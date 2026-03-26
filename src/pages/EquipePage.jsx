import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { getSettings } from '../api';

// Equipe é gerenciada via settings (chave 'equipe')
// Formato: JSON array de { nome, cargo, descricao, foto }

export default function EquipePage() {
  const [membros, setMembros] = useState([]);

  useEffect(() => {
    getSettings('equipe').then(r => {
      try { setMembros(JSON.parse(r.data.value) || []); } catch { setMembros([]); }
    }).catch(() => setMembros([]));
  }, []);

  return (
    <div style={{ minHeight: '80vh', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <p className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--sepia)', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Equipe
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '1.5rem', color: 'var(--parchment)' }}>
          Nossa Equipe
        </h1>
        <div className="divider" style={{ maxWidth: '120px', marginBottom: '2.5rem' }} />

        {membros.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--ash)' }}>
            <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
              Informações da equipe em breve.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
            {membros.map((m, i) => (
              <div key={i} style={{
                border: '1px solid rgba(200,169,110,0.2)',
                background: 'var(--panel)',
                overflow: 'hidden',
              }}>
                {m.foto ? (
                  <img
                    src={m.foto}
                    alt={m.nome}
                    style={{ width: '100%', height: '220px', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '220px', background: 'rgba(200,169,110,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={48} style={{ opacity: 0.2, color: 'var(--sepia)' }} />
                  </div>
                )}
                <div style={{ padding: '1.5rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--parchment)', marginBottom: '0.3rem' }}>
                    {m.nome}
                  </h2>
                  {m.cargo && (
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.1em', color: 'var(--sepia)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      {m.cargo}
                    </p>
                  )}
                  {m.descricao && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--fog)', lineHeight: 1.7 }}>
                      {m.descricao}
                    </p>
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
