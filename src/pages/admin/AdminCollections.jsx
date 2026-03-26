import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getAllCollections, createCollection, updateCollection, deleteCollection, uploadCover } from '../../api';
import { Plus, Edit2, Trash2, Eye, EyeOff, ChevronRight } from 'lucide-react';
import CoverPicker from '../../components/CoverPicker';
import toast from 'react-hot-toast';
import './AdminCollections.css';

const API = import.meta.env.VITE_API_URL || '';
const EMPTY = { name: '', description: '', published: true };

export default function AdminCollections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [coverFile, setCoverFile] = useState(null);   // File object or null
  const [currentCover, setCurrentCover] = useState(null); // existing URL string
  const [saving, setSaving] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const load = () => getAllCollections().then(r => setCollections(r.data)).finally(() => setLoading(false));

  useEffect(() => {
    load();
    if (searchParams.get('new')) openCreate();
  }, []);

  const openCreate = () => {
    setForm(EMPTY);
    setCoverFile(null);
    setCurrentCover(null);
    setModal({ mode: 'create' });
  };

  const openEdit = (col) => {
    setForm({ name: col.name, description: col.description || '', published: !!col.published });
    setCoverFile(null);
    setCurrentCover(col.cover_image || null);
    setModal({ mode: 'edit', id: col.id });
  };

  const closeModal = () => setModal(null);

  // coverFile = File → novo arquivo; null + currentCover = manter; null + !currentCover = sem capa
  const handleCoverChange = (val) => {
    if (val instanceof File) { setCoverFile(val); setCurrentCover(null); }
    else { setCoverFile(null); setCurrentCover(val); } // val = null when removed
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let cover_image = currentCover; // keep existing or null

      if (modal.mode === 'create') {
        const res = await createCollection({ ...form, cover_image: cover_image || null });
        const newId = res.data.id;
        if (coverFile) {
          const up = await uploadCover(coverFile, 'collection', newId);
          cover_image = up.data.url;
        }
        toast.success('Coleção criada!');
      } else {
        if (coverFile) {
          const up = await uploadCover(coverFile, 'collection', modal.id);
          cover_image = up.data.url;
        }
        await updateCollection(modal.id, { ...form, cover_image: cover_image ?? undefined });
        toast.success('Coleção atualizada!');
      }

      closeModal();
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (col) => {
    if (!confirm(`Excluir "${col.name}"? Isso irá remover todos os álbuns e imagens vinculados.`)) return;
    try {
      await deleteCollection(col.id);
      toast.success('Coleção removida');
      load();
    } catch { toast.error('Erro ao remover'); }
  };

  const togglePublished = async (col) => {
    try { await updateCollection(col.id, { published: !col.published }); load(); }
    catch { toast.error('Erro'); }
  };

  return (
    <div className="admin-colecoes">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Coleções</h1>
          <p className="admin-page-sub mono">{collections.length} coleção(ões) cadastradas</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16}/> Nova Coleção</button>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">Carregando...</div>
        ) : collections.length === 0 ? (
          <div className="admin-empty">
            <p>Nenhuma coleção cadastrada.</p>
            <button className="btn btn-ghost" onClick={openCreate}><Plus size={14}/> Criar primeira coleção</button>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Capa</th>
                <th>Nome</th>
                <th>Álbuns</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {collections.map(col => (
                <tr key={col.id} style={{cursor:'pointer'}} onClick={() => navigate(`/admin/colecoes/${col.id}`)}>
                  <td style={{width:56}}>
                    {col.cover_image
                      ? <img src={`${API}${col.cover_image}`} alt="" style={{width:48,height:48,objectFit:'cover',display:'block',border:'1px solid #2e2a25'}} />
                      : <div style={{width:48,height:48,background:'var(--dim)',border:'1px solid #2e2a25'}} />
                    }
                  </td>
                  <td>
                    <div className="admin-table__name">{col.name}</div>
                    {col.description && <div className="admin-table__desc">{col.description}</div>}
                  </td>
                  <td><span className="mono" style={{fontSize:'0.8rem',color:'var(--ash)'}}>{col.album_count}</span></td>
                  <td>
                    <span className={`dashboard__badge ${col.published ? 'published' : 'draft'} mono`}>
                      {col.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="admin-table__actions">
                      <button className="admin-action-btn" title={col.published ? 'Ocultar' : 'Publicar'} onClick={() => togglePublished(col)}>
                        {col.published ? <EyeOff size={15}/> : <Eye size={15}/>}
                      </button>
                      <button className="admin-action-btn" title="Editar" onClick={() => openEdit(col)}>
                        <Edit2 size={15}/>
                      </button>
                      <Link to={`/admin/colecoes/${col.id}`} className="admin-action-btn" title="Gerenciar álbuns">
                        <ChevronRight size={15}/>
                      </Link>
                      <button className="admin-action-btn admin-action-btn--danger" title="Excluir" onClick={() => handleDelete(col)}>
                        <Trash2 size={15}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal animate-scale" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">{modal.mode === 'create' ? 'Nova Coleção' : 'Editar Coleção'}</h2>
            </div>
            <form onSubmit={handleSave} className="modal__body">
              <CoverPicker
                value={coverFile || currentCover}
                onChange={handleCoverChange}
              />
              <div className="form-group">
                <label className="form-label">Nome *</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Ex: Acervo Fotográfico" required />
              </div>
              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea className="form-input" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Descrição da coleção..." rows={3} />
              </div>
              <div className="form-group" style={{flexDirection:'row',alignItems:'center',gap:'12px'}}>
                <input type="checkbox" id="pub" checked={form.published} onChange={e => setForm(f => ({...f, published: e.target.checked}))} style={{width:'auto'}} />
                <label htmlFor="pub" className="form-label" style={{marginBottom:0}}>Publicado (visível no site)</label>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
