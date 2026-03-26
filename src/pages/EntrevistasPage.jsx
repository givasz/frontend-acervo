import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Youtube } from 'lucide-react';
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
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {videos.map((v) => (
              <Link
                key={v.id}
                to={`/material-complementar/entrevistas/${v.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'var(--panel)',
                  border: '1px solid rgba(200,169,110,0.15)',
                  overflow: 'hidden',
                  transition: 'border-color 200ms',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,169,110,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(200,169,110,0.15)'}
                >
                  <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
                    <img
                      src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`}
                      alt={v.titulo}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                    />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={20} fill="white" color="white" style={{ marginLeft: 3 }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--parchment)', lineHeight: 1.4 }}>
                      {v.titulo}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
