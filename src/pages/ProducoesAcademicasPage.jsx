import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { getSettings } from '../api';

export default function ProducoesAcademicasPage() {
  const [producoes, setProducoes] = useState([]);

  useEffect(() => {
    getSettings('producoes_academicas').then(r => {
      try { setProducoes(JSON.parse(r.data.value) || []); } catch { setProducoes([]); }
    }).catch(() => setProducoes([]));
  }, []);

  if (producoes.length === 0) return <div style={{ minHeight: '80vh' }} />;

  return (
    <div style={{ minHeight: '80vh', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {producoes.map((p, i) => (
            <div key={i} style={{
              border: '1px solid #e0dbd8',
              padding: '1.75rem',
              background: 'var(--surface)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  {p.tipo && (
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em',
                      textTransform: 'uppercase', color: 'var(--sepia)', display: 'block', marginBottom: '0.5rem'
                    }}>
                      {p.tipo}
                    </span>
                  )}
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                    {p.titulo}
                  </h2>
                  {p.autores && (
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--fog)', marginBottom: p.resumo ? '1rem' : 0 }}>
                      {p.autores}{p.ano ? ` — ${p.ano}` : ''}
                    </p>
                  )}
                  {p.resumo && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--fog)', lineHeight: 1.7 }}>
                      {p.resumo}
                    </p>
                  )}
                </div>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
                      fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em',
                      color: 'var(--sepia)', textTransform: 'uppercase', textDecoration: 'none',
                      border: '1px solid #d4cec4', padding: '8px 14px', transition: 'all 200ms',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(47,13,19,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <ExternalLink size={13} />
                    Acessar
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
