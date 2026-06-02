import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, BookOpen, GripVertical, FileText } from 'lucide-react';
import { getSettings, updateSettings, readSetting } from '../../api';
import toast from 'react-hot-toast';

const empty = () => ({ id: Date.now().toString(), titulo: '', autor: '', ano: '', link: '' });

export default function AdminPoesias() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings('poesias')
      .then(r => setItens(readSetting(r, []) || []))
      .catch(() => setItens([]))
      .finally(() => setLoading(false));
  }, []);

  const add = () => setItens(v => [...v, empty()]);
  const remove = (i) => setItens(v => v.filter((_, idx) => idx !== i));
  const update = (i, field, value) =>
    setItens(v => v.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));

  const handleSave = async () => {
    if (itens.some(p => !p.titulo.trim())) return toast.error('Preencha o título de todas as poesias');
    if (itens.some(p => !p.link.trim())) return toast.error('Informe o link do PDF de todas as poesias');
    setSaving(true);
    try {
      const toSave = itens.map(({ id, titulo, autor, ano, link }) => ({
        id: id || Date.now().toString(),
        titulo: titulo.trim(), autor: autor.trim(), ano: ano.trim(), link: link.trim(),
      }));
      await updateSettings('poesias', JSON.stringify(toSave));
      toast.success('Poesias salvas!');
    } catch {
      toast.error('Erro ao salvar');
    } finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: '3rem', color: 'var(--ash)' }}>Carregando...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Poesias</h1>
          <p className="admin-page-sub mono">Poesias e textos literários disponibilizados em PDF</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost" onClick={add}>
            <Plus size={15} /> Adicionar poesia
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={15} /> {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '860px' }}>
        {itens.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px dashed #2E2C28', color: 'var(--ash)' }}>
            <BookOpen size={36} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p className="mono" style={{ fontSize: '0.78rem', letterSpacing: '0.1em' }}>
              Nenhuma poesia cadastrada.
            </p>
            <button className="btn btn-ghost" style={{ marginTop: '1rem' }} onClick={add}>
              <Plus size={14} /> Adicionar primeira poesia
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {itens.map((p, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid #2A2826', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <GripVertical size={16} style={{ color: 'var(--ash)', marginTop: '8px', flexShrink: 0 }} />

                <div style={{ width: 44, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
                  <FileText size={22} style={{ color: 'var(--sepia)' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Título *</label>
                    <input
                      className="form-input"
                      placeholder="Ex: Versos da terra"
                      value={p.titulo}
                      onChange={e => update(i, 'titulo', e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.6fr', gap: '10px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Autor(a)</label>
                      <input
                        className="form-input"
                        placeholder="Ex: Maria da Conceição"
                        value={p.autor}
                        onChange={e => update(i, 'autor', e.target.value)}
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Ano</label>
                      <input
                        className="form-input"
                        placeholder="1980"
                        value={p.ano}
                        onChange={e => update(i, 'ano', e.target.value)}
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Link do PDF *</label>
                    <input
                      className="form-input"
                      placeholder="https://.../poesia.pdf"
                      value={p.link}
                      onChange={e => update(i, 'link', e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    />
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mono"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 5, fontSize: '0.7rem', color: 'var(--sepia)' }}
                      >
                        <FileText size={12} /> abrir PDF
                      </a>
                    )}
                  </div>
                </div>

                <button
                  className="admin-action-btn admin-action-btn--danger"
                  onClick={() => remove(i)}
                  title="Remover"
                  style={{ flexShrink: 0 }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
