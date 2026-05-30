
const GRUPO_A = [
  { nome: 'Nome Sobrenome', cor: '#000' },
  { nome: 'Nome Sobrenome', cor: '#000' },
  { nome: 'Nome Sobrenome', cor: '#000' },
];

const GRUPO_B = [
  { nome: 'Nome Sobrenome', cor: '#000' },
  { nome: 'Nome Sobrenome', cor: '#000' },
  { nome: 'Nome Sobrenome', cor: '#000' },
];

const TEXTO_A = 'Texto descritivo sobre o grupo, suas pesquisas, contribuições ao acervo e trajetória acadêmica. Substitua este parágrafo com o conteúdo real da equipe.';
const TEXTO_B = 'Texto descritivo sobre o segundo grupo de colaboradores, suas áreas de atuação e envolvimento com o projeto. Substitua com o conteúdo definitivo.';

function Circles({ pessoas }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
      {pessoas.map((p, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            background: p.cor,
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.06em',
            color: 'var(--fog)',
            textTransform: 'uppercase',
            textAlign: 'center',
            maxWidth: 90,
            lineHeight: 1.4,
          }}>
            {p.nome}
          </span>
        </div>
      ))}
    </div>
  );
}

function TextBlock({ children }) {
  return (
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize: '1.05rem',
      color: 'var(--fog)',
      lineHeight: 1.85,
      maxWidth: 380,
    }}>
      {children}
    </p>
  );
}

export default function EquipePage() {
  return (
    <div style={{ minHeight: '80vh', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(2rem,4vw,3rem)',
          color: '#2f0d13',
          marginBottom: '4rem',
        }}>
          Equipe
        </h1>

        {/* Linha 1: círculos à esquerda, texto à direita */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '4rem',
          flexWrap: 'wrap',
          marginBottom: '5rem',
        }}>
          <Circles pessoas={GRUPO_A} />
          <TextBlock>{TEXTO_A}</TextBlock>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '4rem',
          flexWrap: 'wrap',
        }}>
          <TextBlock>{TEXTO_B}</TextBlock>
          <Circles pessoas={GRUPO_B} />
        </div>

      </div>
    </div>
  );
}
