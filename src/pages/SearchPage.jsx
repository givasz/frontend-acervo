import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchImages } from '../api';
import { Search, Image } from 'lucide-react';
import './SearchPage.css';

const API = import.meta.env.VITE_API_URL || '';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) { setQ(query); doSearch(query); }
  }, []);

  const doSearch = (term) => {
    if (!term?.trim()) return;
    setLoading(true); setSearched(true);
    searchImages(term).then(r => setResults(r.data)).finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q });
    doSearch(q);
  };

  return (
    <div className="search-page">
      <div className="search-page__hero">
        <div className="search-page__hero-bg" />
        <div className="search-page__hero-content">
          <p className="mono" style={{fontSize:'0.7rem',letterSpacing:'0.2em',color:'var(--sepia)',textTransform:'uppercase',marginBottom:'1rem'}}>Pesquisa</p>
          <h1 className="search-page__title">Encontre no <em>Acervo</em></h1>
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-form__input-wrap">
              <Search size={18} className="search-form__icon" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Buscar por título, tags, descrição, tipo de acervo..."
                className="search-form__input"
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary">Buscar</button>
          </form>
        </div>
      </div>

      <div className="search-results">
        {loading && (
          <div className="search-results__grid">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{height:'220px'}} />)}
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="empty-state">
            <Search size={48} opacity={0.2} />
            <p>Nenhum resultado para <strong>"{searchParams.get('q')}"</strong></p>
            <p style={{fontSize:'0.9rem',color:'var(--ash)'}}>Tente outros termos ou navegue pelo acervo.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="search-results__count mono">
              {results.length} resultado{results.length !== 1 ? 's' : ''} para "{searchParams.get('q')}"
            </p>
            <div className="search-results__grid">
              {results.map((img, i) => (
                <Link key={img.id} to={`/imagem/${img.id}`} className="search-result-card animate-fade" style={{animationDelay:`${i*40}ms`}}>
                  <div className="search-result-card__img">
                    <img src={`${API}${img.url}`} alt={img.title || ''} loading="lazy" />
                    <div className="search-result-card__overlay"><Image size={20}/></div>
                  </div>
                  <div className="search-result-card__body">
                    {img.title && <h3 className="search-result-card__title">{img.title}</h3>}
                    {img.collection_name && <p className="mono search-result-card__col">{img.collection_name}</p>}
                    {img.tipo_acervo && <p className="search-result-card__type">{img.tipo_acervo}</p>}
                    {img.tags && (
                      <div className="search-result-card__tags">
                        {img.tags.split(',').slice(0,3).map(t => <span key={t} className="tag">{t.trim()}</span>)}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
