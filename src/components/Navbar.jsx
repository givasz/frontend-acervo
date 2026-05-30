import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import './Navbar.css';

const NAV = [
  {
    label: 'Acervo',
    children: [
      { label: 'Pesquisa no Acervo',   to: '/busca' },
      { label: 'Sobre o Acervo',       to: '/sobre' },
      { label: 'Fotografias',          to: '/acervo/fotografias' },
      { label: 'Memória Oral',         to: '/acervo/memoria-oral' },
    ],
  },
  {
    label: 'Material Complementar',
    children: [
      { label: 'Trabalhos Acadêmicos', to: '/material-complementar/trabalhos-academicos' },
      { label: 'Vídeos',               to: '/material-complementar/videos' },
      { label: 'Poesia',               to: '/material-complementar/poesia' },
    ],
  },
  { label: 'Equipe',   to: '/equipe' },
  { label: 'Contato',  to: '/contato' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setActiveDropdown(null); }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">

        <Link to="/" className="navbar__brand">
          <img src="/logo.png" alt="Logo" className="navbar__logo" />
        </Link>

        <div className="navbar__links">
          {NAV.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="navbar__item"
                onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
              >
                <span className={`navbar__link${activeDropdown === item.label ? ' navbar__link--open' : ''}`}>
                  {item.label}
                  <ChevronDown
                    size={13}
                    className={`navbar__chevron${activeDropdown === item.label ? ' open' : ''}`}
                  />
                </span>
                <div className={`navbar__dropdown${activeDropdown === item.label ? ' visible' : ''}`}>
                  <div className="navbar__dropdown-inner">
                    {item.children.map(child => (
                      <Link key={child.to} to={child.to} className="navbar__dropdown-item">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={`navbar__link${location.pathname === item.to ? ' navbar__link--active' : ''}`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <button className="navbar__mobile-toggle" onClick={() => setOpen(s => !s)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="navbar__mobile-menu animate-slide">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.label} className="navbar__mobile-section">
                <span className="navbar__mobile-label">{item.label}</span>
                {item.children.map(child => (
                  <Link key={child.to} to={child.to} className="navbar__mobile-link">
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={item.to} to={item.to} className="navbar__mobile-link">
                {item.label}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
}
