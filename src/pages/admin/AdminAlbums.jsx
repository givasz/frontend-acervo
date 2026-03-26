import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllAlbums, getAllCollections, createAlbum, updateAlbum, deleteAlbum, uploadCover } from '../../api';
import { Plus, Edit2, Trash2, Eye, EyeOff, ChevronRight } from 'lucide-react';
import CoverPicker from '../../components/CoverPicker';
import toast from 'react-hot-toast';
import './AdminCollections.css';

const API = import.meta.env.VITE_API_URL || '';
const EMPTY = { title: '', description: '', collection_id: '', published: true };

export default function AdminAlbums() {
  const [albums, setAlbums] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [coverFile, setCoverFile] = useState(null);
  const [currentCover, setCurrentCover] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterCol, setFilterCol] = useState('');
  const navigate = useNavigate();

  const load = () => Promise.all([
    getAllAlbums(filterCol || undefined),
    getAllCollections()
  ]).then(([a, c]) => {
    setAlbums(a.data);
    setCollections(c.data);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, [filterCol]);

  const openCreate = () => {
    setForm(EMPTY);
    setCoverFile(null);
    setCurrentCover(null);
    setModal({ mode: 'create' });
  };

  const openEdit = (alb) => {
    setForm({ title: alb.title, description: alb.description || '', collection_id: alb.collection_id, published: !!alb.published });
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
    if (!form.collection_id) return toast.error('Selecione uma coleção');
    setSaving(true);
    try {
      let cover_image = currentCover;

      if (modal.mode === 'create') {
        const res = await createAlbum({ ...form, cover_image: cover_image || null });
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
    if (!confirm(`Excluir "${alb.title}"? Todas as imagens serão removidas.`)) return;
    try { await deleteAlbum(alb.id); toast.success('Álbum removido'); load(); }
    catch { toast.error('Erro ao remover'); }
  };

  const togglePublished = async (alb) => {
    try { await updateAlbum(alb.id, { published: !alb.published }); load(); }
    catch { toast.error('Erro'); }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Álbuns</h1>
          <p className="admin-page-sub mono">{albums.length} álbum(ns)</p>
        </div>
        <div className="admin-page-actions">
          <select className="form-input" style={{width:'auto',padding:'8px 14px'}} value={filterCol} onChange={e => setFilterCol(e.target.value)}>
            <option value="">Todas as coleções</option>
            {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={16}/> Novo Álbum</button>
        </div>
      </div>

      <div className="admin-table-wrap">
        {loading ? <div className="admin-loading">Carregando...</div>
          : albums.length === 0 ? (
            <div className="admin-empty">
              <p>Nenhum álbum encontrado.</p>
              <button className="btn btn-ghost" onClick={openCreate}><Plus size={14}/> Criar álbum</button>
            </div>
          ) : (
            <table className="admin-table">
              <thead><tr><th>Capa</th><th>Título</th><th>Coleção</th><th>Imagens</th><th>Status</th><th>Ações</th></tr></thead>
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
                    <td><span className="mono" style={{fontSize:'0.78rem',color:'var(--sepia)'}}>{alb.collection_name}</span></td>
                    <td><span className="mono" style={{fontSize:'0.8rem',color:'var(--ash)'}}>{alb.image_count}</span></td>
                    <td><span className={`dashboard__badge ${alb.published ? 'published' : 'draft'} mono`}>{alb.published ? 'Publicado' : 'Rascunho'}</span></td>
                    <td>
                      <div className="admin-table__actions" onClick={e => e.stopPropagation()}>
                        <button className="admin-action-btn" onClick={() => togglePublished(alb)}>{alb.published ? <EyeOff size={15}/> : <Eye size={15}/>}</button>
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
                <label className="form-label">Coleção *</label>
                <select className="form-input" value={form.collection_id} onChange={e => setForm(f => ({...f, collection_id: e.target.value}))} required>
                  <option value="">Selecione uma coleção</option>
                  {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Título *</label>
                <input className="form-input" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="Nome do álbum" required />
              </div>
              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea className="form-input" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} />
              </div>
              <div className="form-group" style={{flexDirection:'row',alignItems:'center',gap:'12px'}}>
                <input type="checkbox" id="apub" checked={form.published} onChange={e => setForm(f => ({...f, published: e.target.checked}))} style={{width:'auto'}} />
                <label htmlFor="apub" className="form-label" style={{marginBottom:0}}>Publicado</label>
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
