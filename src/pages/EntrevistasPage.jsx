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

  if (videos.length === 0) return <div style={{ minHeight: '80vh' }} />;

  return (
    <div style={{ minHeight: '80vh', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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
                e.currentTarget.querySelector('.card').style.borderColor = 'var(--sepia)';
                e.currentTarget.querySelector('.card').style.transform = 'translateY(-4px)';
                e.currentTarget.querySelector('.play-btn').style.transform = 'translate(-50%,-50%) scale(1.15)';
                e.currentTarget.querySelector('.thumb').style.opacity = '1';
              }}
              onMouseLeave={e => {
                e.currentTarget.querySelector('.card').style.borderColor = '#e0dbd8';
                e.currentTarget.querySelector('.card').style.transform = 'translateY(0)';
                e.currentTarget.querySelector('.play-btn').style.transform = 'translate(-50%,-50%) scale(1)';
                e.currentTarget.querySelector('.thumb').style.opacity = '0.85';
              }}
            >
              <div className="card" style={{
                border: '1px solid #e0dbd8',
                background: 'var(--surface)',
                overflow: 'hidden',
                transition: 'border-color 250ms, transform 250ms, box-shadow 250ms',
              }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#111' }}>
                  <img
                    className="thumb"
                    src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`}
                    alt={v.titulo}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85, transition: 'opacity 250ms' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
                  <div className="play-btn" style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    border: '1.5px solid rgba(255,255,255,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 250ms',
                  }}>
                    <Play size={20} fill="#fff" color="#fff" style={{ marginLeft: 3 }} />
                  </div>
                </div>

                <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: '1.15rem',
                    color: '#2f0d13',
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
      </div>
    </div>
  );
}
