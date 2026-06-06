import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCollections, getSettings, readSetting } from '../api';
import { Archive, ChevronRight, Layers } from 'lucide-react';
import Carousel from '../components/Carousel';
import './Home.css';

const API = import.meta.env.VITE_API_URL || '';

export default function Home() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerSlides, setBannerSlides] = useState([]);

  useEffect(() => {
    getCollections().then(r => setCollections(r.data)).finally(() => setLoading(false));

    // Carrossel do topo — fotos definidas pelo admin (setting "home_banner")
    getSettings('home_banner')
      .then(r => {
        const items = readSetting(r, []) || [];
        setBannerSlides(
          items
            .filter(it => it && it.url)
            .map((it, i) => ({
              id: `banner-${i}`,
              image: `${API}${it.url}`,
              title: it.title || '',
            }))
        );
      })
      .catch(() => {});
  }, []);

  const scrollToCollections = (e) => {
    e.preventDefault();
    document.getElementById('colecoes')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home">
      {/* Banner principal — carrossel gerenciado pelo admin (alterna sozinho se houver mais de uma foto) */}
      {bannerSlides.length > 0 && (
        <section className="home-banner">
          <Carousel slides={bannerSlides} aspect="58vh" />
        </section>
      )}

      {/* Hero / intro */}
      <section className="hero hero--compact">
        <div className="hero__bg">
          <div className="hero__lines" />
        </div>
        <div className="hero__content">
          <p className="hero__eyebrow mono">Patrimônio Cultural · Memória Histórica</p>
          <h1 className="hero__title">
            Acervo<br />
            <em>Maria da</em><br />
            Conceição
          </h1>
          <div className="divider" style={{maxWidth: '200px', margin: '2rem 0'}} />
          <p className="hero__desc">
            Uma coleção dedicada à preservação e difusão da memória histórica,
            reúne documentos, fotografias e registros que contam a história
            através do tempo.
          </p>
          <div className="hero__actions">
            <a href="#colecoes" onClick={scrollToCollections} className="btn btn-primary">
              <Archive size={16} /> Explorar Acervo
            </a>
            <Link to="/sobre" className="btn btn-ghost">Sobre o Acervo</Link>
          </div>
        </div>
        <div className="hero__ornament">
          <span className="hero__ornament-text">est. 2024</span>
        </div>
      </section>

      {/* Collections */}
      <section id="colecoes" className="collections-section">
        <div className="section-header">
          <div className="section-header__line" />
          <div className="section-header__content">
            <span className="mono" style={{fontSize:'0.7rem', letterSpacing:'0.2em', color:'var(--sepia)', textTransform:'uppercase'}}>
              Coleções Disponíveis
            </span>
            <h2 className="section-header__title">Acervo</h2>
          </div>
        </div>

        {loading ? (
          <div className="collections-grid">
            {[1,2,3].map(i => <div key={i} className="collection-card skeleton" style={{height:'280px'}} />)}
          </div>
        ) : collections.length === 0 ? (
          <div className="empty-state">
            <Layers size={48} opacity={0.2} />
            <p>Nenhuma coleção disponível ainda.</p>
          </div>
        ) : (
          <div className="collections-grid">
            {collections.map((col, i) => (
              <Link
                key={col.id}
                to={`/acervo/${col.slug}`}
                className="collection-card animate-fade"
                style={{animationDelay: `${i * 80}ms`}}
              >
                <div className="collection-card__cover">
                  {col.cover_image
                    ? <img src={`${API}${col.cover_image}`} alt={col.name} />
                    : <div className="collection-card__no-cover"><Archive size={40} /></div>
                  }
                  <div className="collection-card__overlay" />
                  <div className="collection-card__hover-overlay">
                    <span className="collection-card__hover-title">{col.name}</span>
                    <span className="btn btn-primary btn-sm">Ver coleção</span>
                  </div>
                  <div className="collection-card__badge mono">{col.album_count} álbuns</div>
                </div>
                <div className="collection-card__body">
                  <h3 className="collection-card__title">{col.name}</h3>
                  {col.description && <p className="collection-card__desc">{col.description}</p>}
                  <span className="collection-card__cta mono">
                    Ver coleção <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
