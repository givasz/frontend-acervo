import { Link } from 'react-router-dom';
import './Footer.css';

const LINKS = [
  { label: 'Sobre o Acervo', to: '/sobre' },
  { label: 'Fotografias', to: '/acervo/fotografias' },
  { label: 'Memória Oral', to: '/acervo/memoria-oral' },
  { label: 'Catalogação', to: '/catalogacao' },
  { label: 'Trabalhos Acadêmicos', to: '/material-complementar/trabalhos-academicos' },
  { label: 'Equipe', to: '/equipe' },
  { label: 'Contato', to: '/contato' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span className="site-footer__title">Acervo Maria da Conceição</span>
          <p className="site-footer__tagline">
            Preservação e difusão da memória histórica.
          </p>
        </div>

        <nav className="site-footer__nav">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="site-footer__link">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="site-footer__germinal">
          <img src="/geminal-logo.png" alt="Logo Cineclube Germinal" />
          <img src="/Logo-LHist.png" alt="Logo LHist — Laboratório de História Social do Trabalho (UESB)" className="site-footer__lhist" />
        </div>
      </div>

      <div className="site-footer__bottom">
        <span className="mono">© {new Date().getFullYear()} Acervo Maria da Conceição</span>
        <span className="mono">Patrimônio Cultural · Memória Histórica</span>
      </div>
    </footer>
  );
}
