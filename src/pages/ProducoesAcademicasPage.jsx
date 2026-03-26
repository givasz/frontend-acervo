import { useState, useEffect } from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import { getSettings } from '../api';

// Produções são gerenciadas via settings (chave 'producoes_academicas')
// Formato: JSON array de { titulo, autores, ano, tipo, resumo, link }

export default function ProducoesAcademicasPage() {
  const [producoes, setProducoes] = useState([]);

  useEffect(() => {
    getSettings('producoes_academicas').then(r => {
      try { setProducoes(JSON.parse(r.data.value) || []); } catch { setProducoes([]); }
    }).catch(() => setProducoes([]));
  }, []);

  return (
    <div style={{ minHeight: '80vh', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <p className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--sepia)', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Material Complementar
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '1.5rem', color: 'var(--parchment)' }}>
          Produções Acadêmicas
        </h1>
        <div className="divider" style={{ maxWidth: '120px', marginBottom: '2.5rem' }} />

        {producoes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--ash)' }}>
            <BookOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
              Nenhuma produção acadêmica disponível ainda.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {producoes.map((p, i) => (
              <div key={i} style={{
                border: '1px solid rgba(200,169,110,0.2)',
                padding: '1.75rem',
                background: 'var(--panel)',
                transition: 'border-color 200ms',
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
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--parchment)', lineHeight: 1.4, marginBottom: '0.5rem' }}>
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
                        border: '1px solid rgba(200,169,110,0.3)', padding: '8px 14px',
                        transition: 'all 200ms',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,169,110,0.1)'}
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
        )}
      </div>
    </div>
  );
}
