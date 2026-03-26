import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Youtube, GripVertical } from 'lucide-react';
import { getSettings, updateSettings } from '../../api';
import toast from 'react-hot-toast';

function extractYoutubeId(input) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = input.match(p);
    if (m) return m[1];
  }
  return null;
}

const empty = () => ({ id: Date.now().toString(), titulo: '', descricao: '', youtube_id: '', _url: '' });

export default function AdminEntrevistas() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings('entrevistas')
      .then(r => { try { setVideos(JSON.parse(r.data.value) || []); } catch { setVideos([]); } })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  const add = () => setVideos(v => [...v, empty()]);

  const remove = (i) => setVideos(v => v.filter((_, idx) => idx !== i));

  const update = (i, field, value) => {
    setVideos(v => v.map((item, idx) => {
      if (idx !== i) return item;
      const updated = { ...item, [field]: value };
      if (field === '_url') {
        const id = extractYoutubeId(value);
        updated.youtube_id = id || '';
      }
      return updated;
    }));
  };

  const handleSave = async () => {
    const invalid = videos.some(v => !v.titulo || !v.youtube_id);
    if (invalid) return toast.error('Preencha título e URL do YouTube em todos os vídeos');
    setSaving(true);
    try {
      const toSave = videos.map(({ id, titulo, descricao, youtube_id }) => ({ id: id || Date.now().toString(), titulo, descricao, youtube_id }));
      await updateSettings('entrevistas', JSON.stringify(toSave));
      toast.success('Entrevistas salvas!');
    } catch {
      toast.error('Erro ao salvar');
    } finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: '3rem', color: 'var(--ash)' }}>Carregando...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Entrevistas</h1>
          <p className="admin-page-sub mono">Gerenciar vídeos do YouTube incorporados no site</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost" onClick={add}>
            <Plus size={15} /> Adicionar vídeo
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={15} /> {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '860px' }}>
        {videos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px dashed #2e2a25', color: 'var(--ash)' }}>
            <Youtube size={36} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p className="mono" style={{ fontSize: '0.78rem', letterSpacing: '0.1em' }}>
              Nenhuma entrevista cadastrada.
            </p>
            <button className="btn btn-ghost" style={{ marginTop: '1rem' }} onClick={add}>
              <Plus size={14} /> Adicionar primeiro vídeo
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {videos.map((v, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid #2e2a25', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <GripVertical size={16} style={{ color: 'var(--ash)', marginTop: '8px', flexShrink: 0 }} />

                {/* Thumbnail preview */}
                <div style={{ width: '120px', flexShrink: 0 }}>
                  {v.youtube_id ? (
                    <img
                      src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`}
                      alt=""
                      style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', aspectRatio: '16/9', background: '#1a1714', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Youtube size={24} style={{ opacity: 0.2 }} />
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">URL ou ID do YouTube</label>
                    <input
                      className="form-input"
                      placeholder="https://youtube.com/watch?v=... ou apenas o ID"
                      value={v._url || v.youtube_id}
                      onChange={e => update(i, '_url', e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    />
                    {v._url && !v.youtube_id && (
                      <p style={{ color: 'var(--ember)', fontSize: '0.72rem', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                        URL inválida — cole o link completo do YouTube
                      </p>
                    )}
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Título</label>
                    <input
                      className="form-input"
                      placeholder="Ex: Entrevista com Maria da Conceição"
                      value={v.titulo}
                      onChange={e => update(i, 'titulo', e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Texto sobre o entrevistado (opcional)</label>
                    <textarea
                      className="form-input"
                      placeholder="Breve apresentação do entrevistado, contexto da entrevista..."
                      value={v.descricao}
                      onChange={e => update(i, 'descricao', e.target.value)}
                      rows={4}
                      style={{ fontSize: '0.85rem', resize: 'vertical' }}
                    />
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
