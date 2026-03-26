import { Link } from 'react-router-dom';
import { Archive } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--panel)',
      borderTop: '1px solid rgba(200,169,110,0.1)',
      padding: '3rem 2rem',
      marginTop: 'auto',
    }}>
      <div style={{maxWidth:'1400px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem'}}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <Archive size={16} style={{color:'var(--sepia)'}} />
          <span style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:'0.95rem'}}>Acervo Maria da Conceição</span>
        </div>
        <p style={{fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--ash)'}}>
          Todos os direitos reservados
        </p>
        <Link to="/admin" style={{fontFamily:'var(--font-mono)', fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--ash)', transition:'color 200ms'}}>
          Admin ↗
        </Link>
      </div>
    </footer>
  );
}
