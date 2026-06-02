import { useState, useEffect } from 'react';
import { FileText, Download, BookOpen } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import useAcervoImages from '../hooks/useAcervoImages';
import { getSettings } from '../api';
import './content.css';

export default function PoesiaPage() {
  const [poesias, setPoesias] = useState([]);
  const [loading, setLoading] = useState(true);
  const { bannerAt } = useAcervoImages();

  useEffect(() => {
    getSettings('poesias')
      .then((r) => {
        try { setPoesias(JSON.parse(r.data.value) || []); } catch { setPoesias([]); }
      })
      .catch(() => setPoesias([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade">
      <PageHeader
        eyebrow="Material Complementar"
        title="Poesias"
        description="Reunião de poesias e textos literários do acervo, disponíveis para leitura e download em PDF."
        image={bannerAt(3)}
      />

      <div className="content content-narrow">
        {loading ? (
          <div className="doc-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="doc-item">
                <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 4 }} />
                <div className="doc-item__body">
                  <div className="skeleton" style={{ width: '60%', height: 18, marginBottom: 8 }} />
                  <div className="skeleton" style={{ width: '35%', height: 12 }} />
                </div>
              </div>
            ))}
          </div>
        ) : poesias.length === 0 ? (
          <div className="content-empty">
            <BookOpen size={44} opacity={0.25} />
            <p>As poesias em PDF aparecerão aqui assim que forem disponibilizadas.</p>
          </div>
        ) : (
          <div className="doc-list">
            {poesias.map((p, i) => (
              <a
                key={i}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="doc-item"
              >
                <span className="doc-item__icon"><FileText size={26} strokeWidth={1.4} /></span>
                <div className="doc-item__body">
                  <span className="doc-item__title">{p.titulo}</span>
                  <span className="doc-item__meta">
                    {[p.autor, p.ano].filter(Boolean).join(' · ')}
                  </span>
                </div>
                <span className="doc-item__action"><Download size={14} /> PDF</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
