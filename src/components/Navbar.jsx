import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, ChevronDown, Archive } from 'lucide-react';
import { getCollections } from '../api';
import './Navbar.css';

export default function Navbar() {
  const [collections, setCollections] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    getCollections().then(r => setCollections(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setActiveDropdown(null); }, [location]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchQ)}`;
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <div className="navbar__brand-icon"><Archive size={18} /></div>
          <div className="navbar__brand-text">
            <span className="navbar__brand-title">Acervo</span>
            <span className="navbar__brand-subtitle">Maria da Conceição</span>
          </div>
        </Link>

        <div className="navbar__links">
          {/* 1. Acervo — dropdown com coleções */}
          <div
            className="navbar__item navbar__item--dropdown"
            onMouseEnter={() => setActiveDropdown('acervo')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span className="navbar__link">
              Acervo <ChevronDown size={14} className={`navbar__chevron ${activeDropdown === 'acervo' ? 'open' : ''}`} />
            </span>
            <div className={`navbar__dropdown ${activeDropdown === 'acervo' ? 'visible' : ''}`}>
              <div className="navbar__dropdown-inner">
                {collections.length === 0 && <span className="navbar__dropdown-empty">Nenhuma coleção</span>}
                {collections.map(col => (
                  <Link key={col.id} to={`/acervo/${col.slug}`} className="navbar__dropdown-item">
                    {col.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 2. O Acervo */}
          <Link to="/sobre" className="navbar__link">O Acervo</Link>

          {/* 3. Pesquisa */}
          <Link to="/busca" className="navbar__link">Pesquisa</Link>

          {/* 4. Catalogação */}
          <Link to="/catalogacao" className="navbar__link">Catalogação</Link>

          {/* 5. Material Complementar — dropdown */}
          <div
            className="navbar__item navbar__item--dropdown"
            onMouseEnter={() => setActiveDropdown('material')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span className="navbar__link">
              Material Complementar <ChevronDown size={14} className={`navbar__chevron ${activeDropdown === 'material' ? 'open' : ''}`} />
            </span>
            <div className={`navbar__dropdown ${activeDropdown === 'material' ? 'visible' : ''}`}>
              <div className="navbar__dropdown-inner">
                <Link to="/material-complementar/entrevistas" className="navbar__dropdown-item">
                  Entrevistas
                </Link>
                <Link to="/material-complementar/producoes-academicas" className="navbar__dropdown-item">
                  Produções Acadêmicas
                </Link>
              </div>
            </div>
          </div>

          {/* 6. Equipe */}
          <Link to="/equipe" className="navbar__link">Equipe</Link>

          {/* 7. Contato */}
          <Link to="/contato" className="navbar__link">Contato</Link>

          <button className="navbar__search-btn" onClick={() => setSearchOpen(s => !s)}>
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
        </div>

        <button className="navbar__mobile-toggle" onClick={() => setOpen(s => !s)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {searchOpen && (
        <div className="navbar__search-bar animate-fade">
          <form onSubmit={handleSearch} className="navbar__search-form">
            <Search size={16} className="navbar__search-icon" />
            <input
              ref={searchRef}
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Buscar no acervo por título, tags, conteúdo..."
              className="navbar__search-input"
            />
            <button type="submit" className="btn btn-primary btn-sm">Buscar</button>
          </form>
        </div>
      )}

      {open && (
        <div className="navbar__mobile-menu animate-slide">
          <div className="navbar__mobile-section">
            <span className="navbar__mobile-label">Acervo</span>
            {collections.map(col => (
              <Link key={col.id} to={`/acervo/${col.slug}`} className="navbar__mobile-link">{col.name}</Link>
            ))}
          </div>
          <Link to="/sobre" className="navbar__mobile-link">O Acervo</Link>
          <Link to="/busca" className="navbar__mobile-link">Pesquisa</Link>
          <Link to="/catalogacao" className="navbar__mobile-link">Catalogação</Link>
          <div className="navbar__mobile-section" style={{ marginTop: '12px' }}>
            <span className="navbar__mobile-label">Material Complementar</span>
            <Link to="/material-complementar/entrevistas" className="navbar__mobile-link">Entrevistas</Link>
            <Link to="/material-complementar/producoes-academicas" className="navbar__mobile-link">Produções Acadêmicas</Link>
          </div>
          <Link to="/equipe" className="navbar__mobile-link">Equipe</Link>
          <Link to="/contato" className="navbar__mobile-link">Contato</Link>
        </div>
      )}
    </nav>
  );
}
