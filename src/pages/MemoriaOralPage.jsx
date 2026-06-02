import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Mic } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import useAcervoImages from '../hooks/useAcervoImages';
import { getSettings } from '../api';
import './content.css';
import './MemoriaOralPage.css';

const VARIANTS = {
  memoria: {
    eyebrow: 'Acervo · Memória Oral',
    title: 'Memória Oral',
    description: 'Entrevistas e relatos em vídeo que preservam vozes, histórias e testemunhos. Cada registro conduz ao conteúdo original.',
    banner: 2,
  },
  videos: {
    eyebrow: 'Material Complementar',
    title: 'Vídeos',
    description: 'Vídeos e relatos incorporados do YouTube reunidos como material complementar do acervo.',
    banner: 5,
  },
};

export default function MemoriaOralPage({ variant = 'memoria' }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { bannerAt } = useAcervoImages();
  const v = VARIANTS[variant] || VARIANTS.memoria;

  useEffect(() => {
    getSettings('entrevistas')
      .then((r) => {
        try { setVideos(JSON.parse(r.data.value) || []); } catch { setVideos([]); }
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade">
      <PageHeader
        eyebrow={v.eyebrow}
        title={v.title}
        description={v.description}
        image={bannerAt(v.banner)}
      />

      <div className="content">
        {loading ? (
          <div className="memoria-grid">
            {[1, 2, 3].map((i) => <div key={i} className="memoria-card skeleton" style={{ height: 280 }} />)}
          </div>
        ) : videos.length === 0 ? (
          <div className="content-empty">
            <Mic size={44} opacity={0.25} />
            <p>As entrevistas e relatos em vídeo aparecerão aqui assim que forem publicados.</p>
          </div>
        ) : (
          <div className="memoria-grid">
            {videos.map((v) => (
              <Link key={v.id} to={`/material-complementar/videos/${v.id}`} className="memoria-card">
                <div className="memoria-card__thumb">
                  <img
                    src={`https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`}
                    alt={v.titulo}
                    loading="lazy"
                  />
                  <div className="memoria-card__thumb-shade" />
                  <div className="memoria-card__play"><Play size={20} fill="#fff" color="#fff" /></div>
                </div>
                <div className="memoria-card__body">
                  <h3 className="memoria-card__title">{v.titulo}</h3>
                  {v.descricao && <p className="memoria-card__desc">{v.descricao}</p>}
                  <span className="memoria-card__cta mono">Assistir relato →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
