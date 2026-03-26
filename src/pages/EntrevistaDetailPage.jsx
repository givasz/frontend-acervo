import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Youtube } from 'lucide-react';
import { getSettings } from '../api';

export default function EntrevistaDetailPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings('entrevistas').then(r => {
      try {
        const videos = JSON.parse(r.data.value) || [];
        setVideo(videos.find(v => v.id === id) || null);
      } catch { setVideo(null); }
    }).catch(() => setVideo(null))
    .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ash)' }}>
      Carregando...
    </div>
  );

  if (!video) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--ash)' }}>
      <Youtube size={48} style={{ opacity: 0.3 }} />
      <p className="mono" style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>Entrevista não encontrada.</p>
      <Link to="/material-complementar/entrevistas" style={{ color: 'var(--sepia)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
        ← Voltar para entrevistas
      </Link>
    </div>
  );

  return (
    <div style={{ minHeight: '80vh', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <Link
          to="/material-complementar/entrevistas"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--ash)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.08em', textDecoration: 'none', marginBottom: '2rem' }}
        >
          <ChevronLeft size={14} /> Entrevistas
        </Link>

        <p className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--sepia)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Material Complementar — Entrevistas
        </p>

        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', color: 'var(--parchment)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
          {video.titulo}
        </h1>

        <div className="divider" style={{ maxWidth: '120px', marginBottom: '2rem' }} />

        {/* Vídeo */}
        <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000', marginBottom: '2rem' }}>
          <iframe
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            src={`https://www.youtube.com/embed/${video.youtube_id}`}
            title={video.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Texto sobre o entrevistado */}
        {video.descricao && (
          <div style={{
            borderLeft: '2px solid rgba(200,169,110,0.3)',
            paddingLeft: '1.5rem',
            marginTop: '1.5rem',
          }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--fog)', lineHeight: 1.8 }}>
              {video.descricao}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
