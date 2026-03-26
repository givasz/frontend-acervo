import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAllCollections, getAllAlbums, createAlbum, updateAlbum, deleteAlbum, uploadCover, updateCollection } from '../../api';
import { Plus, Edit2, Trash2, Eye, EyeOff, ChevronRight, ChevronLeft, ImagePlus } from 'lucide-react';
import CoverPicker from '../../components/CoverPicker';
import toast from 'react-hot-toast';
import './AdminCollections.css';

const API = import.meta.env.VITE_API_URL || '';
const EMPTY = { title: '', description: '', published: true };

export default function AdminCollectionDetail() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [coverFile, setCoverFile] = useState(null);
  const [currentCover, setCurrentCover] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const colCoverRef = useRef();

  const handleColCoverChange = async (file) => {
    if (!file) return;
    try {
      const up = await uploadCover(file, 'collection', id);
      await updateCollection(id, { cover_image: up.data.url });
      setCollection(c => ({ ...c, cover_image: up.data.url }));
      toast.success('Capa da coleção atualizada!');
    } catch { toast.error('Erro ao atualizar capa'); }
  };

  const load = async () => {
    const [colsRes, albsRes] = await Promise.all([
      getAllCollections(),
      getAllAlbums(id)
    ]);
    const col = colsRes.data.find(c => String(c.id) === String(id));
    setCollection(col);
    setAlbums(albsRes.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const openCreate = () => {
    setForm(EMPTY);
    setCoverFile(null);
    setCurrentCover(null);
    setModal({ mode: 'create' });
  };

  const openEdit = (alb) => {
    setForm({ title: alb.title, description: alb.description || '', published: !!alb.published });
    setCoverFile(null);
    setCurrentCover(alb.cover_image || null);
    setModal({ mode: 'edit', id: alb.id });
  };

  const handleCoverChange = (val) => {
    if (val instanceof File) { setCoverFile(val); setCurrentCover(null); }
    else { setCoverFile(null); setCurrentCover(val); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let cover_image = currentCover;

      if (modal.mode === 'create') {
        const res = await createAlbum({ ...form, collection_id: id, cover_image: cover_image || null });
        const newId = res.data.id;
        if (coverFile) {
          const up = await uploadCover(coverFile, 'album', newId);
          cover_image = up.data.url;
        }
        toast.success('Álbum criado!');
      } else {
        if (coverFile) {
          const up = await uploadCover(coverFile, 'album', modal.id);
          cover_image = up.data.url;
        }
        await updateAlbum(modal.id, { ...form, cover_image: cover_image ?? undefined });
        toast.success('Álbum atualizado!');
      }

      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao salvar');
    } finally { setSaving(false); }
  };

  const handleDelete = async (alb) => {
    if (!confirm(`Excluir "${alb.title}"?`)) return;
    try { await deleteAlbum(alb.id); toast.success('Álbum removido'); load(); }
    catch { toast.error('Erro ao remover'); }
  };

  const togglePub = async (alb) => {
    try { await updateAlbum(alb.id, { published: !alb.published }); load(); }
    catch { toast.error('Erro'); }
  };

  if (loading) return <div className="admin-loading" style={{padding:'4rem'}}>Carregando...</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
          {/* Cover thumbnail */}
          <div style={{position:'relative',flexShrink:0}}>
            <input ref={colCoverRef} type="file" accept="image/*" style={{display:'none'}} onChange={e => e.target.files[0] && handleColCoverChange(e.target.files[0])} />
            <div
              onClick={() => colCoverRef.current?.click()}
              title="Clique para trocar a capa"
              style={{
                width:80, height:80, flexShrink:0, cursor:'pointer',
                border:'1px solid #3a3530', position:'relative', overflow:'hidden',
                background:'var(--dim)',
              }}
            >
              {collection?.cover_image
                ? <img src={`${API}${collection.cover_image}`} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
                : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--ash)'}}><ImagePlus size={22}/></div>
              }
              <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.45)',display:'flex',alignItems:'center',justifyContent:'center',opacity:0,transition:'opacity 0.2s'}}
                onMouseEnter={e=>e.currentTarget.style.opacity=1}
                onMouseLeave={e=>e.currentTarget.style.opacity=0}
              >
                <ImagePlus size={18} color="white"/>
              </div>
            </div>
          </div>
          <div>
            <Link to="/admin/colecoes" className="back-link mono" style={{marginBottom:'8px',display:'inline-flex',alignItems:'center',gap:'6px',fontSize:'0.68rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--ash)'}}>
              <ChevronLeft size={13}/> Coleções
            </Link>
            <h1 className="admin-page-title">{collection?.name}</h1>
            <p className="admin-page-sub mono">{albums.length} álbum(ns)</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16}/> Novo Álbum</button>
      </div>

      <div className="admin-table-wrap">
        {albums.length === 0 ? (
          <div className="admin-empty">
            <p>Nenhum álbum nesta coleção.</p>
            <button className="btn btn-ghost" onClick={openCreate}><Plus size={14}/> Criar álbum</button>
          </div>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Capa</th><th>Título</th><th>Imagens</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {albums.map(alb => (
                <tr key={alb.id} style={{cursor:'pointer'}} onClick={() => navigate(`/admin/albuns/${alb.id}`)}>
                  <td style={{width:56}}>
                    {alb.cover_image
                      ? <img src={`${API}${alb.cover_image}`} alt="" style={{width:48,height:48,objectFit:'cover',display:'block',border:'1px solid #2e2a25'}} />
                      : <div style={{width:48,height:48,background:'var(--dim)',border:'1px solid #2e2a25'}} />
                    }
                  </td>
                  <td><div className="admin-table__name">{alb.title}</div>{alb.description && <div className="admin-table__desc">{alb.description}</div>}</td>
                  <td><span className="mono" style={{fontSize:'0.8rem',color:'var(--ash)'}}>{alb.image_count}</span></td>
                  <td><span className={`dashboard__badge ${alb.published ? 'published' : 'draft'} mono`}>{alb.published ? 'Publicado' : 'Rascunho'}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="admin-table__actions">
                      <button className="admin-action-btn" onClick={() => togglePub(alb)}>{alb.published ? <EyeOff size={15}/> : <Eye size={15}/>}</button>
                      <button className="admin-action-btn" onClick={() => openEdit(alb)}><Edit2 size={15}/></button>
                      <Link to={`/admin/albuns/${alb.id}`} className="admin-action-btn"><ChevronRight size={15}/></Link>
                      <button className="admin-action-btn admin-action-btn--danger" onClick={() => handleDelete(alb)}><Trash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal animate-scale" onClick={e => e.stopPropagation()}>
            <div className="modal__header"><h2 className="modal__title">{modal.mode === 'create' ? 'Novo Álbum' : 'Editar Álbum'}</h2></div>
            <form onSubmit={handleSave} className="modal__body">
              <CoverPicker
                value={coverFile || currentCover}
                onChange={handleCoverChange}
              />
              <div className="form-group">
                <label className="form-label">Título *</label>
                <input className="form-input" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea className="form-input" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} />
              </div>
              <div className="form-group" style={{flexDirection:'row',alignItems:'center',gap:'12px'}}>
                <input type="checkbox" id="apub2" checked={form.published} onChange={e => setForm(f => ({...f, published: e.target.checked}))} style={{width:'auto'}} />
                <label htmlFor="apub2" className="form-label" style={{marginBottom:0}}>Publicado</label>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
