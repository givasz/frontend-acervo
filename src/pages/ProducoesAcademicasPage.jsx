import { useState, useEffect } from 'react';
import { ExternalLink, GraduationCap } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import useAcervoImages from '../hooks/useAcervoImages';
import { getSettings, readSetting } from '../api';
import './content.css';

export default function ProducoesAcademicasPage() {
  const [producoes, setProducoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { bannerAt } = useAcervoImages();

  useEffect(() => {
    getSettings('producoes_academicas')
      .then((r) => setProducoes(readSetting(r, []) || []))
      .catch(() => setProducoes([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade">
      <PageHeader
        eyebrow="Material Complementar"
        title="Trabalhos Acadêmicos"
        description="Monografias, dissertações, artigos e demais produções acadêmicas relacionadas ao acervo, com acesso ao documento original."
        image={bannerAt(6)}
      />

      <div className="content">
        {loading ? (
          <div className="academic-table-wrap">
            <div className="skeleton" style={{ height: 220 }} />
          </div>
        ) : producoes.length === 0 ? (
          <div className="content-empty">
            <GraduationCap size={44} opacity={0.25} />
            <p>Os trabalhos acadêmicos aparecerão aqui assim que forem cadastrados.</p>
          </div>
        ) : (
          <div className="academic-table-wrap">
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Autoria</th>
                  <th>Informações</th>
                  <th>Acesso</th>
                </tr>
              </thead>
              <tbody>
                {producoes.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <span className="academic-table__title">{p.titulo}</span>
                    </td>
                    <td className="academic-table__author">{p.autores || '—'}</td>
                    <td className="academic-table__info">
                      {[p.tipo, p.ano].filter(Boolean).join(' · ') || '—'}
                      {p.resumo && (
                        <span style={{ display: 'block', marginTop: 6, color: 'var(--fog)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                          {p.resumo}
                        </span>
                      )}
                    </td>
                    <td>
                      {p.link ? (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="academic-table__link">
                          <ExternalLink size={13} /> Acessar
                        </a>
                      ) : (
                        <span className="academic-table__info">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
