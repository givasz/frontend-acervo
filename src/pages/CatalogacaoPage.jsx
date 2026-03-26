export default function CatalogacaoPage() {
  return (
    <div style={{ minHeight: '80vh', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--sepia)', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Catalogação
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '1.5rem', color: 'var(--parchment)' }}>
          Metodologia de Catalogação
        </h1>
        <div className="divider" style={{ maxWidth: '120px', marginBottom: '2.5rem' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--fog)', lineHeight: 1.8 }}>
          <p>
            O acervo organiza seu conjunto documental a partir de uma metodologia arquivística que busca preservar
            o contexto original de produção dos documentos, respeitando o princípio da proveniência e a ordem original.
          </p>

          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--parchment)', marginBottom: '1rem' }}>
              Estrutura de Organização
            </h2>
            <p>
              O acervo está organizado em <strong style={{ color: 'var(--sepia)' }}>coleções temáticas</strong>, subdivididas em
              álbuns que reúnem documentos por critérios de proximidade temática, cronológica ou tipológica.
              Cada item recebe tratamento descritivo individual, com preenchimento de campos de metadados padronizados.
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--parchment)', marginBottom: '1rem' }}>
              Campos de Metadados
            </h2>
            <div style={{ display: 'grid', gap: '0', border: '1px solid rgba(200,169,110,0.2)' }}>
              {[
                ['Título', 'Nome ou descrição curta da fotografia'],
                ['Tema / Categoria', 'Ex.: Movimentos dos Trabalhadores'],
                ['Subtema', 'Subdivisão temática dentro da categoria (opcional)'],
                ['Data', 'Data aproximada ou exata — ano, mês/ano ou data completa'],
                ['Descrição', 'Texto explicativo sobre o contexto da fotografia (acessibilidade)'],
                ['Origem / Crédito', 'Fotógrafo, instituição ou fonte de origem'],
                ['Suporte', 'Material físico no qual a imagem está registrada'],
              ].map(([campo, desc], i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr',
                  borderBottom: i < 6 ? '1px solid rgba(200,169,110,0.1)' : 'none',
                }}>
                  <div style={{
                    padding: '12px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.06em',
                    color: 'var(--sepia)',
                    textTransform: 'uppercase',
                    borderRight: '1px solid rgba(200,169,110,0.1)',
                    background: 'rgba(200,169,110,0.03)',
                  }}>
                    {campo}
                  </div>
                  <div style={{ padding: '12px 16px', fontSize: '0.95rem' }}>
                    {desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--parchment)', marginBottom: '1rem' }}>
              Normas de Referência
            </h2>
            <p>
              A descrição segue as orientações do <strong style={{ color: 'var(--sepia)' }}>Conselho Nacional de Arquivos (CONARQ)</strong> e
              as normas internacionais de descrição arquivística ISAD(G), adaptadas à natureza fotográfica do acervo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
