import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCollections, getSettings, readSetting } from '../api';
import { Archive, Layers } from 'lucide-react';
import './Home.css';

const API = import.meta.env.VITE_API_URL || '';

export default function Home() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    getCollections()
      .then(r => setCollections(Array.isArray(r.data) ? r.data : []))
      .catch(() => setCollections([]))
      .finally(() => setLoading(false));

    // Fotos da seção "Memória, Trabalho, Território" — definidas pelo admin (setting "home_banner")
    getSettings('home_banner')
      .then(r => {
        const items = readSetting(r, []) || [];
        setPhotos(
          items
            .filter(it => it && it.url)
            .map((it, i) => ({ id: `foto-${i}`, src: `${API}${it.url}`, title: it.title || '' }))
        );
      })
      .catch(() => {});
  }, []);

  // Sem fotos no banner, usa as capas das coleções
  const gallery = photos.length > 0
    ? photos
    : collections
        .filter(c => c.cover_image)
        .map(c => ({ id: `col-${c.id}`, src: `${API}${c.cover_image}`, title: c.name }));

  return (
    <div className="home">
      {/* Sobre o acervo */}
      <section className="home-section">
        <h1 className="home-title">Sobre o acervo</h1>
        <hr className="home-rule" />
        <div className="home-text">
          <p>
            O Acervo Maria da Conceição visa à recuperação, organização e preservação
            da documentação produzida pelos movimentos de trabalhadores do Sudoeste da
            Bahia e suas entidades ao longo da história.
          </p>
          <p>
            É constituído por importantes conjuntos documentais referentes à organização
            dos trabalhadores, permitindo conhecer o papel desempenhado por trabalhadores e
            trabalhadoras baianos em diferentes movimentos e em diferentes períodos históricos.
          </p>
        </div>
        <Link to="/sobre" className="home-tag">Saiba mais</Link>
        <hr className="home-rule" />
      </section>

      {/* Memória · Trabalho · Território */}
      <section className="home-section">
        <h2 className="home-title home-title--stack">
          <span>Memória</span>
          <span>Trabalho</span>
          <span>Território</span>
        </h2>

        {gallery.length > 0 && (
          <div className="home-gallery">
            {gallery.slice(0, 6).map(p => (
              <figure key={p.id} className="home-gallery__item">
                <img src={p.src} alt={p.title} loading="lazy" />
              </figure>
            ))}
          </div>
        )}
      </section>

      {/* Explorar o acervo */}
      <section id="colecoes" className="home-section">
        <h2 className="home-title">Explorar o acervo</h2>
        <hr className="home-rule" />

        {loading ? (
          <div className="home-collections">
            {[1, 2, 3].map(i => <div key={i} className="home-col skeleton" style={{ height: '220px' }} />)}
          </div>
        ) : collections.length === 0 ? (
          <div className="home-empty">
            <Layers size={40} opacity={0.25} />
            <p>Nenhuma coleção disponível ainda.</p>
          </div>
        ) : (
          <div className="home-collections">
            {collections.map((col, i) => (
              <Link key={col.id} to={`/acervo/${col.slug}`} className="home-col">
                <div className="home-col__cover">
                  {col.cover_image
                    ? <img src={`${API}${col.cover_image}`} alt={col.name} loading="lazy" />
                    : <div className="home-col__no-cover"><Archive size={36} /></div>}
                </div>
                <div className="home-col__body">
                  <h3 className="home-col__title">{col.name}</h3>
                  <span className="home-col__num">Coleção {String(i + 1).padStart(2, '0')}</span>
                  <span className="home-tag">Acessar coleção</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
