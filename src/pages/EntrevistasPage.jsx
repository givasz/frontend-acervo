import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
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
        <div className="divider" style={{ maxWidth: '120px', marginBottom: '3rem' }} />

        {videos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--ash)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
              Nenhuma entrevista disponível ainda.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem',
          }}>
            {videos.map((v) => (
              <Link
                key={v.id}
                to={`/material-complementar/entrevistas/${v.id}`}
                style={{ textDecoration: 'none', display: 'block' }}
                onMouseEnter={e => {
                  e.currentTarget.querySelector('.card').style.borderColor = 'rgba(200,169,110,0.5)';
                  e.currentTarget.querySelector('.card').style.transform = 'translateY(-4px)';
                  e.currentTarget.querySelector('.play-btn').style.transform = 'translate(-50%,-50%) scale(1.15)';
                  e.currentTarget.querySelector('.thumb').style.opacity = '1';
                }}
                onMouseLeave={e => {
                  e.currentTarget.querySelector('.card').style.borderColor = 'rgba(200,169,110,0.15)';
                  e.currentTarget.querySelector('.card').style.transform = 'translateY(0)';
                  e.currentTarget.querySelector('.play-btn').style.transform = 'translate(-50%,-50%) scale(1)';
                  e.currentTarget.querySelector('.thumb').style.opacity = '0.8';
                }}
              >
                <div className="card" style={{
                  border: '1px solid rgba(200,169,110,0.15)',
                  background: 'var(--panel)',
                  overflow: 'hidden',
                  transition: 'border-color 250ms, transform 250ms',
                }}>
                  {/* Thumbnail */}
                  <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#0a0a0a' }}>
                    <img
                      className="thumb"
                      src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`}
                      alt={v.titulo}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, transition: 'opacity 250ms' }}
                    />
                    {/* Gradient overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
                    {/* Play button */}
                    <div className="play-btn" style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%,-50%)',
                      width: 52, height: 52, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.65)',
                      border: '1.5px solid rgba(200,169,110,0.6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'transform 250ms',
                    }}>
                      <Play size={20} fill="rgba(200,169,110,0.9)" color="rgba(200,169,110,0.9)" style={{ marginLeft: 3 }} />
                    </div>
                  </div>

                  {/* Name */}
                  <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontSize: '1.15rem',
                      color: 'var(--parchment)',
                      lineHeight: 1.35,
                      margin: 0,
                    }}>
                      {v.titulo}
                    </p>
                    <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: 20, height: '1px', background: 'var(--sepia)' }} />
                      <span className="mono" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--sepia)', textTransform: 'uppercase' }}>
                        Ver entrevista
                      </span>
                    </div>
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
