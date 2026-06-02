import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import './Navbar.css';

const NAV = [
  {
    label: 'Acervo',
    children: [
      { label: 'Sobre o Acervo', to: '/sobre' },
      { label: 'Fotografias', to: '/acervo/fotografias' },
      { label: 'Memória Oral', to: '/acervo/memoria-oral' },
    ],
  },
  { label: 'Catalogação', to: '/catalogacao' },
  {
    label: 'Material Complementar',
    children: [
      { label: 'Trabalhos Acadêmicos', to: '/material-complementar/trabalhos-academicos' },
      { label: 'Vídeos', to: '/material-complementar/videos' },
      { label: 'Poesia', to: '/material-complementar/poesia' },
    ],
  },
  { label: 'Equipe', to: '/equipe' },
  { label: 'Contato', to: '/contato' },
];

// Nome legível da página atual (mostrado ao lado do ícone do acervo)
const EXACT_TITLES = {
  '/sobre': 'Sobre o Acervo',
  '/acervo/fotografias': 'Fotografias',
  '/acervo/memoria-oral': 'Memória Oral',
  '/catalogacao': 'Catalogação',
  '/material-complementar/trabalhos-academicos': 'Trabalhos Acadêmicos',
  '/material-complementar/videos': 'Vídeos',
  '/material-complementar/poesia': 'Poesia',
  '/equipe': 'Equipe',
  '/contato': 'Contato',
  '/busca': 'Pesquisa',
};

function pageTitle(pathname) {
  if (pathname === '/') return null;
  if (EXACT_TITLES[pathname]) return EXACT_TITLES[pathname];
  if (pathname.startsWith('/material-complementar/videos/')) return 'Vídeo';
  if (pathname.startsWith('/material-complementar/entrevistas')) return 'Memória Oral';
  if (pathname.startsWith('/material-complementar/producoes')) return 'Trabalhos Acadêmicos';
  if (pathname.startsWith('/acervo/')) return 'Coleção';
  if (pathname.startsWith('/album/')) return 'Álbum';
  if (pathname.startsWith('/imagem/')) return 'Imagem';
  return null;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const currentTitle = pageTitle(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const isActive = (to) => location.pathname === to;
  const groupActive = (item) =>
    item.children?.some((c) => location.pathname === c.to) || false;

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">

        <Link to="/" className="navbar__brand">
          <img src="/logo.png" alt="Logo" className="navbar__logo" />
          {currentTitle && (
            <span className="navbar__current">
              <span className="navbar__current-sep" />
              <span className="navbar__current-text mono">{currentTitle}</span>
            </span>
          )}
        </Link>

        <div className="navbar__links">
          {NAV.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="navbar__item"
                onClick={() =>
                  setActiveDropdown(activeDropdown === item.label ? null : item.label)
                }
              >
                <span
                  className={`navbar__link${activeDropdown === item.label ? ' navbar__link--open' : ''}${groupActive(item) ? ' navbar__link--active' : ''}`}
                >
                  {item.label}
                  <ChevronDown
                    size={13}
                    className={`navbar__chevron${activeDropdown === item.label ? ' open' : ''}`}
                  />
                </span>

                <div className={`navbar__dropdown${activeDropdown === item.label ? ' visible' : ''}`}>
                  <div className="navbar__dropdown-inner">
                    {item.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className={`navbar__dropdown-item${isActive(child.to) ? ' navbar__dropdown-item--active' : ''}`}
                        onClick={(e) => e.stopPropagation()}
                      >
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
                className={`navbar__link${isActive(item.to) ? ' navbar__link--active' : ''}`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <button className="navbar__mobile-toggle" onClick={() => setOpen((s) => !s)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="navbar__mobile-menu animate-slide">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.label} className="navbar__mobile-section">
                <span className="navbar__mobile-label">{item.label}</span>
                {item.children.map((child) => (
                  <Link
                    key={child.to}
                    to={child.to}
                    className={`navbar__mobile-link${isActive(child.to) ? ' navbar__mobile-link--active' : ''}`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={`navbar__mobile-link${isActive(item.to) ? ' navbar__mobile-link--active' : ''}`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
}
