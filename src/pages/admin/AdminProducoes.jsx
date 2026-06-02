import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, GraduationCap, GripVertical, ExternalLink } from 'lucide-react';
import { getSettings, updateSettings, readSetting } from '../../api';
import toast from 'react-hot-toast';

const TIPOS = ['Monografia', 'Dissertação', 'Tese', 'Artigo', 'TCC', 'Livro', 'Capítulo', 'Outro'];

const empty = () => ({ id: Date.now().toString(), tipo: '', titulo: '', autores: '', ano: '', resumo: '', link: '' });

export default function AdminProducoes() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings('producoes_academicas')
      .then(r => setItens(readSetting(r, []) || []))
      .catch(() => setItens([]))
      .finally(() => setLoading(false));
  }, []);

  const add = () => setItens(v => [...v, empty()]);
  const remove = (i) => setItens(v => v.filter((_, idx) => idx !== i));
  const update = (i, field, value) =>
    setItens(v => v.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));

  const handleSave = async () => {
    if (itens.some(p => !p.titulo.trim())) return toast.error('Preencha o título de todos os trabalhos');
    setSaving(true);
    try {
      const toSave = itens.map(({ id, tipo, titulo, autores, ano, resumo, link }) => ({
        id: id || Date.now().toString(),
        tipo: tipo.trim(), titulo: titulo.trim(), autores: autores.trim(),
        ano: ano.trim(), resumo: resumo.trim(), link: link.trim(),
      }));
      await updateSettings('producoes_academicas', JSON.stringify(toSave));
      toast.success('Trabalhos acadêmicos salvos!');
    } catch {
      toast.error('Erro ao salvar');
    } finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: '3rem', color: 'var(--ash)' }}>Carregando...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Trabalhos Acadêmicos</h1>
          <p className="admin-page-sub mono">Monografias, dissertações, artigos e produções relacionadas ao acervo</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost" onClick={add}>
            <Plus size={15} /> Adicionar trabalho
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={15} /> {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '900px' }}>
        {itens.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px dashed #2E2C28', color: 'var(--ash)' }}>
            <GraduationCap size={36} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p className="mono" style={{ fontSize: '0.78rem', letterSpacing: '0.1em' }}>
              Nenhum trabalho cadastrado.
            </p>
            <button className="btn btn-ghost" style={{ marginTop: '1rem' }} onClick={add}>
              <Plus size={14} /> Adicionar primeiro trabalho
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {itens.map((p, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid #2A2826', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <GripVertical size={16} style={{ color: 'var(--ash)', marginTop: '8px', flexShrink: 0 }} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Título do trabalho *</label>
                    <input
                      className="form-input"
                      placeholder="Ex: Memória e patrimônio: o acervo como fonte histórica"
                      value={p.titulo}
                      onChange={e => update(i, 'titulo', e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 0.6fr', gap: '10px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Autoria</label>
                      <input
                        className="form-input"
                        placeholder="Ex: Silva, J.; Souza, M."
                        value={p.autores}
                        onChange={e => update(i, 'autores', e.target.value)}
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Tipo</label>
                      <select
                        className="form-input"
                        value={p.tipo}
                        onChange={e => update(i, 'tipo', e.target.value)}
                        style={{ fontSize: '0.85rem' }}
                      >
                        <option value="">—</option>
                        {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Ano</label>
                      <input
                        className="form-input"
                        placeholder="2024"
                        value={p.ano}
                        onChange={e => update(i, 'ano', e.target.value)}
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Resumo (opcional)</label>
                    <textarea
                      className="form-input"
                      placeholder="Breve descrição do trabalho..."
                      value={p.resumo}
                      onChange={e => update(i, 'resumo', e.target.value)}
                      rows={3}
                      style={{ fontSize: '0.85rem', resize: 'vertical' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Link para o documento</label>
                    <input
                      className="form-input"
                      placeholder="https://..."
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
                        <ExternalLink size={12} /> testar link
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
