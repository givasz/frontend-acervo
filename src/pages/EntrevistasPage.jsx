import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Youtube, ChevronRight } from 'lucide-react';
import { getSettings } from '../api';

export default function EntrevistasPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getSettings('entrevistas').then(r => {
      try { setVideos(JSON.parse(r.data.value) || []); } catch { setVideos([]); }
    }).catch(() => setVideos([]));
  }, []);

  return (
    <div style={{ minHeight: '80vh', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <p className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--sepia)', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Material Complementar
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '1.5rem', color: 'var(--parchment)' }}>
          Entrevistas
        </h1>
        <div className="divider" style={{ maxWidth: '120px', marginBottom: '2.5rem' }} />

        {videos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--ash)' }}>
            <Youtube size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
              Nenhuma entrevista disponível ainda.
            </p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {videos.map((v, i) => (
              <li key={v.id}>
                {i > 0 && <div style={{ height: '1px', background: 'rgba(200,169,110,0.12)' }} />}
                <Link
                  to={`/material-complementar/entrevistas/${v.id}`}
                  onMouseEnter={e => { e.currentTarget.style.paddingLeft = '0.75rem'; e.currentTarget.querySelector('.arrow').style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.paddingLeft = '0.25rem'; e.currentTarget.querySelector('.arrow').style.opacity = '0'; }}
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem 0.25rem', color: 'inherit', transition: 'padding-left 180ms ease' }}
                >
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--parchment)', lineHeight: 1.4 }}>
                    {v.titulo}
                  </span>
                  <ChevronRight className="arrow" size={16} style={{ color: 'var(--sepia)', flexShrink: 0, opacity: 0, transition: 'opacity 180ms ease' }} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
