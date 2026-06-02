import PageHeader from '../components/PageHeader';
import useAcervoImages from '../hooks/useAcervoImages';
import './content.css';

// Substitua nomes/funções e adicione `foto` (URL) quando houver.
const COORDENACAO = [
  { nome: 'Nome Sobrenome', funcao: 'Coordenação' },
  { nome: 'Nome Sobrenome', funcao: 'Pesquisa' },
];

const COLABORADORES = [
  { nome: 'Nome Sobrenome', funcao: 'Documentação' },
  { nome: 'Nome Sobrenome', funcao: 'Catalogação' },
  { nome: 'Nome Sobrenome', funcao: 'Digitalização' },
  { nome: 'Nome Sobrenome', funcao: 'Curadoria' },
];

function initials(nome) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

function Member({ p }) {
  return (
    <div className="team-member">
      <div className="team-member__photo">
        {p.foto
          ? <img src={p.foto} alt={p.nome} />
          : <span className="team-member__initials">{initials(p.nome)}</span>}
      </div>
      <span className="team-member__name">{p.nome}</span>
      <span className="team-member__role">{p.funcao}</span>
    </div>
  );
}

export default function EquipePage() {
  const { bannerAt } = useAcervoImages();

  return (
    <div className="animate-fade">
      <PageHeader
        eyebrow="Acervo"
        title="Equipe"
        description="As pessoas por trás da pesquisa, documentação e preservação do Acervo Maria da Conceição."
        image={bannerAt(7)}
      />

      <div className="content">
        <section className="content-section" style={{ marginTop: '2.5rem' }}>
          <span className="content-section__label">Coordenação</span>
          <h2 className="content-section__title">Quem conduz o projeto</h2>
          <div className="team-grid">
            {COORDENACAO.map((p, i) => <Member key={i} p={p} />)}
          </div>
        </section>

        <div className="content-rule" />

        <section>
          <span className="content-section__label">Colaboradores</span>
          <h2 className="content-section__title">Equipe de pesquisa e documentação</h2>
          <div className="team-grid">
            {COLABORADORES.map((p, i) => <Member key={i} p={p} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
