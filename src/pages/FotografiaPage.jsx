import { Link } from 'react-router-dom';
import { Image } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import useAcervoImages from '../hooks/useAcervoImages';
import './content.css';

const API = import.meta.env.VITE_API_URL || '';

export default function FotografiaPage() {
  const { collections, bannerAt, loading } = useAcervoImages();

  return (
    <div className="animate-fade">
      <PageHeader
        eyebrow="Acervo · Fotografias"
        title="Fotografia"
        description="Conjuntos fotográficos do acervo organizados por coleção. Cada imagem é uma porta de entrada para os álbuns relacionados."
        image={bannerAt(1)}
      />

      <div className="content">
        {loading ? (
          <div className="photo-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="photo-card skeleton" />
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="content-empty">
            <Image size={44} opacity={0.25} />
            <p>As coleções fotográficas aparecerão aqui assim que forem publicadas no acervo.</p>
          </div>
        ) : (
          <div className="photo-grid">
            {collections.map((col, i) => (
              <Link
                key={col.id}
                to={`/acervo/${col.slug}`}
                className="photo-card animate-scale"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {col.cover_image ? (
                  <img src={`${API}${col.cover_image}`} alt={col.name} loading="lazy" />
                ) : (
                  <div className="photo-card__no-img"><Image size={36} /></div>
                )}
                <div className="photo-card__shade" />
                <div className="photo-card__caption">
                  <span className="photo-card__title">{col.name}</span>
                  <span className="photo-card__sub">
                    {col.album_count} {col.album_count === 1 ? 'álbum' : 'álbuns'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
