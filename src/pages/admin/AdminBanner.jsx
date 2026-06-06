import { useState, useEffect, useRef } from 'react';
import { getSettings, updateSettings, readSetting, uploadFile } from '../../api';
import { Save, Trash2, ArrowUp, ArrowDown, ImagePlus, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || '';

export default function AdminBanner() {
  const [items, setItems] = useState([]); // [{ url, title }]
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    getSettings('home_banner')
      .then(r => setItems(readSetting(r, []) || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const r = await uploadFile(file);
        if (r.data?.url) uploaded.push({ url: r.data.url, title: '' });
      }
      setItems(prev => [...prev, ...uploaded]);
      toast.success(`${uploaded.length} foto(s) adicionada(s) — lembre de salvar`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao enviar imagem');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const move = (i, dir) => {
    setItems(prev => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const remove = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const setTitle = (i, title) => setItems(prev => prev.map((it, idx) => idx === i ? { ...it, title } : it));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings('home_banner', items);
      toast.success('Banner da página inicial salvo!');
    } catch {
      toast.error('Erro ao salvar o banner');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Banner da Página Inicial</h1>
          <p className="admin-page-sub mono">Fotos do carrossel do topo — alternam sozinhas quando há mais de uma</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={15}/> {saving ? 'Salvando...' : 'Salvar Banner'}
        </button>
      </div>

      <div style={{padding:'2.5rem',display:'flex',flexDirection:'column',gap:'1.5rem',maxWidth:'820px'}}>

        <div style={{background:'var(--surface)',border:'1px solid var(--border)',padding:'2rem'}}>
          <p className="mono" style={{fontSize:'0.7rem',color:'var(--ash)',letterSpacing:'0.06em',marginBottom:'1.5rem'}}>
            Envie uma ou mais fotos. Você pode reordenar e remover. A legenda é opcional.
            As mudanças só ficam ativas no site depois de <strong>Salvar Banner</strong>.
          </p>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleUpload}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
              gap:8,width:'100%',padding:'28px 0',marginBottom: items.length ? '1.5rem' : 0,
              border:'1px dashed var(--border)',color:'var(--ash)',cursor:'pointer',
            }}
          >
            {uploading ? <Loader size={22} className="spin" /> : <ImagePlus size={22} />}
            <span className="mono" style={{fontSize:'0.7rem',letterSpacing:'0.08em'}}>
              {uploading ? 'Enviando...' : 'Adicionar foto(s) ao banner'}
            </span>
          </button>

          {loading ? (
            <p style={{color:'var(--ash)',fontSize:'0.85rem'}}>Carregando...</p>
          ) : items.length === 0 ? (
            <p className="mono" style={{color:'var(--ash)',fontSize:'0.75rem',letterSpacing:'0.06em',textAlign:'center'}}>
              Nenhuma foto no banner ainda.
            </p>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {items.map((it, i) => (
                <div key={`${it.url}-${i}`} style={{
                  display:'flex',alignItems:'center',gap:'14px',
                  padding:'10px',border:'1px solid var(--border)',background:'rgba(196,168,130,0.03)',
                }}>
                  <span className="mono" style={{fontSize:'0.7rem',color:'var(--ash)',width:'22px',textAlign:'center',flexShrink:0}}>{i + 1}</span>
                  <img
                    src={`${API}${it.url}`}
                    alt=""
                    style={{width:'110px',height:'68px',objectFit:'cover',border:'1px solid var(--border)',flexShrink:0}}
                  />
                  <input
                    className="form-input"
                    value={it.title || ''}
                    onChange={e => setTitle(i, e.target.value)}
                    placeholder="Legenda (opcional)"
                    style={{flex:1,fontSize:'0.88rem',padding:'8px 10px'}}
                  />
                  <div style={{display:'flex',gap:'4px',flexShrink:0}}>
                    <button className="admin-action-btn" onClick={() => move(i, -1)} disabled={i === 0} title="Mover para cima">
                      <ArrowUp size={15}/>
                    </button>
                    <button className="admin-action-btn" onClick={() => move(i, 1)} disabled={i === items.length - 1} title="Mover para baixo">
                      <ArrowDown size={15}/>
                    </button>
                    <button className="admin-action-btn admin-action-btn--danger" onClick={() => remove(i)} title="Remover">
                      <Trash2 size={15}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{alignSelf:'flex-start'}}>
          <Save size={15}/> {saving ? 'Salvando...' : 'Salvar Banner'}
        </button>
      </div>
    </div>
  );
}
