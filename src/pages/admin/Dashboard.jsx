import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCollections, getAllAlbums, getImages } from '../../api';
import { Layers, Archive, Image, Plus } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({ collections: 0, albums: 0, images: 0 });
  const [recentCollections, setRecentCollections] = useState([]);

  useEffect(() => {
    Promise.all([getAllCollections(), getAllAlbums()]).then(([cols, albs]) => {
      setStats(s => ({ ...s, collections: cols.data.length, albums: albs.data.length }));
      setRecentCollections(cols.data.slice(0, 5));
    });
  }, []);

  return (
    <div className="dashboard">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub mono">Visão geral do acervo</p>
        </div>
      </div>

      <div className="dashboard__stats">
        {[
          { label: 'Coleções', value: stats.collections, icon: <Layers size={24}/>, to: '/admin/colecoes' },
          { label: 'Álbuns', value: stats.albums, icon: <Archive size={24}/>, to: '/admin/albuns' },
          { label: 'Imagens', value: stats.images, icon: <Image size={24}/>, to: '/admin/imagens' },
        ].map(s => (
          <Link key={s.label} to={s.to} className="stat-card">
            <div className="stat-card__icon">{s.icon}</div>
            <div className="stat-card__body">
              <span className="stat-card__value">{s.value}</span>
              <span className="stat-card__label mono">{s.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="dashboard__section">
        <div className="dashboard__section-header">
          <h2 className="dashboard__section-title">Coleções</h2>
          <Link to="/admin/colecoes" className="btn btn-ghost btn-sm"><Plus size={14}/> Nova coleção</Link>
        </div>
        <div className="dashboard__list">
          {recentCollections.map(col => (
            <Link key={col.id} to={`/admin/colecoes/${col.id}`} className="dashboard__list-item">
              <div>
                <span className="dashboard__list-name">{col.name}</span>
                <span className="mono dashboard__list-meta">{col.album_count} álbuns</span>
              </div>
              <span className={`dashboard__badge ${col.published ? 'published' : 'draft'} mono`}>
                {col.published ? 'Publicado' : 'Rascunho'}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="dashboard__quick">
        <h2 className="dashboard__section-title" style={{marginBottom:'1rem'}}>Ações rápidas</h2>
        <div className="dashboard__quick-grid">
          <Link to="/admin/colecoes?new=1" className="quick-card">
            <Layers size={28}/>
            <span>Nova Coleção</span>
          </Link>
          <Link to="/admin/albuns?new=1" className="quick-card">
            <Archive size={28}/>
            <span>Novo Álbum</span>
          </Link>
          <Link to="/admin/imagens?upload=1" className="quick-card">
            <Image size={28}/>
            <span>Upload de Imagens</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
