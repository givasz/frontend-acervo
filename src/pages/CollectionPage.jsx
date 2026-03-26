import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCollection } from '../api';
import { Image, ChevronRight, ArrowLeft } from 'lucide-react';
import './CollectionPage.css';

const API = import.meta.env.VITE_API_URL || '';

export default function CollectionPage() {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCollection(slug).then(r => setCollection(r.data)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="collection-page">
      <div className="collection-page__header skeleton" style={{height:'280px'}} />
      <div className="albums-grid" style={{padding:'4rem 2rem'}}>
        {[1,2,3,4].map(i => <div key={i} className="album-card skeleton" style={{height:'220px'}} />)}
      </div>
    </div>
  );

  if (!collection) return (
    <div className="collection-page" style={{padding:'8rem 2rem', textAlign:'center'}}>
      <p style={{color:'var(--ash)'}}>Coleção não encontrada.</p>
      <Link to="/" className="btn btn-ghost" style={{marginTop:'1rem'}}><ArrowLeft size={16}/> Voltar</Link>
    </div>
  );

  return (
    <div className="collection-page animate-fade">
      <div className="collection-page__header">
        <div className="collection-page__header-bg">
          {collection.cover_image && <img src={`${API}${collection.cover_image}`} alt="" />}
          <div className="collection-page__header-overlay" />
        </div>
        <div className="collection-page__header-content">
          <Link to="/" className="back-link mono"><ArrowLeft size={14}/> Início</Link>
          <div className="collection-page__label mono">Acervo</div>
          <h1 className="collection-page__title">{collection.name}</h1>
          {collection.description && <p className="collection-page__desc">{collection.description}</p>}
          <div className="collection-page__stats mono">
            <span>{collection.albums?.length || 0} álbuns</span>
          </div>
        </div>
      </div>

      <div className="albums-section">
        <div className="section-header" style={{padding:'0 2rem', maxWidth:'1400px', margin:'0 auto 2rem'}}>
          <div className="section-header__line" />
          <div className="section-header__content">
            <h2 style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:'1.8rem'}}>Álbuns</h2>
          </div>
        </div>

        {collection.albums?.length === 0 ? (
          <div className="empty-state"><Image size={48} opacity={0.2}/><p>Nenhum álbum nesta coleção.</p></div>
        ) : (
          <div className="albums-grid">
            {collection.albums?.map((album, i) => (
              <Link
                key={album.id}
                to={`/album/${album.id}`}
                className="album-card animate-fade"
                style={{animationDelay:`${i*60}ms`}}
              >
                <div className="album-card__cover">
                  {album.cover_image
                    ? <img src={`${API}${album.cover_image}`} alt={album.title} />
                    : <div className="album-card__no-cover"><Image size={32}/></div>
                  }
                  <div className="album-card__overlay" />
                </div>
                <div className="album-card__body">
                  <h3 className="album-card__title">{album.title}</h3>
                  {album.description && <p className="album-card__desc">{album.description}</p>}
                  <span className="album-card__cta mono">Ver álbum <ChevronRight size={13}/></span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
