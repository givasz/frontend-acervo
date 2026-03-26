import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllAlbums, getImages } from '../../api';
import { Image } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

export default function AdminImages() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllAlbums().then(r => { setAlbums(r.data); if (r.data[0]) setSelectedAlbum(String(r.data[0].id)); });
  }, []);

  useEffect(() => {
    if (!selectedAlbum) return;
    setLoading(true);
    getImages(selectedAlbum).then(r => setImages(r.data)).finally(() => setLoading(false));
  }, [selectedAlbum]);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Imagens</h1>
          <p className="admin-page-sub mono">Visualização e gerenciamento</p>
        </div>
        <select className="form-input" style={{width:'auto',padding:'8px 14px'}} value={selectedAlbum} onChange={e => setSelectedAlbum(e.target.value)}>
          <option value="">Selecione um álbum</option>
          {albums.map(a => <option key={a.id} value={a.id}>{a.collection_name} — {a.title}</option>)}
        </select>
      </div>

      {selectedAlbum && (
        <div style={{padding:'0 2.5rem 1rem'}}>
          <Link to={`/admin/albuns/${selectedAlbum}`} className="btn btn-ghost btn-sm">
            Gerenciar este álbum (upload / metadados)
          </Link>
        </div>
      )}

      <div style={{padding:'0 2.5rem 4rem'}}>
        {loading ? <div className="admin-loading">Carregando...</div>
          : images.length === 0 ? (
            <div className="admin-empty"><Image size={40} opacity={0.2}/><p>Nenhuma imagem.</p></div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'10px'}}>
              {images.map(img => (
                <div key={img.id} style={{background:'var(--surface)',border:'1px solid #2e2a25',overflow:'hidden'}}>
                  <img src={`${API}${img.url}`} alt={img.title||''} style={{width:'100%',height:'130px',objectFit:'cover'}} loading="lazy" />
                  <div style={{padding:'8px 10px'}}>
                    <span style={{fontStyle:'italic',fontSize:'0.82rem',display:'block',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{img.title||'Sem título'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
