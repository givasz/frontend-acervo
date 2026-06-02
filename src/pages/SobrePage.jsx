import PageHeader from '../components/PageHeader';
import useAcervoImages from '../hooks/useAcervoImages';
import './content.css';

// Integrantes da pesquisa — substitua nomes/funções e adicione `foto` (URL) quando houver.
const EQUIPE_PESQUISA = [
  { nome: 'Integrante', funcao: 'Pesquisa de campo' },
  { nome: 'Integrante', funcao: 'Documentação' },
  { nome: 'Integrante', funcao: 'Catalogação' },
  { nome: 'Integrante', funcao: 'Digitalização' },
];

function initials(nome) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

export default function SobrePage() {
  const { bannerAt } = useAcervoImages();

  return (
    <div className="animate-fade">
      <PageHeader
        eyebrow="Acervo"
        title="Sobre o Acervo"
        description="O Acervo Maria da Conceição reúne documentos, fotografias e registros orais preservados ao longo de um trabalho contínuo de pesquisa, documentação e catalogação da memória histórica."
        image={bannerAt(0)}
      />

      <div className="content content-narrow">
        <section className="content-section">
          <span className="content-section__label">Como a pesquisa foi realizada</span>
          <h2 className="content-section__title">Um trabalho de campo e de arquivo</h2>
          <div className="prose">
            <p>
              A constituição do acervo partiu do levantamento de fontes primárias —
              documentos pessoais, correspondências, fotografias e objetos — reunidas
              junto a familiares, colaboradores e instituições parceiras. Cada conjunto
              documental foi identificado, higienizado e registrado antes de integrar
              a coleção.
            </p>
            <p>
              O trabalho combinou entrevistas, visitas de campo e consulta a arquivos,
              buscando reconstituir contextos históricos e preservar relatos que de
              outra forma se perderiam com o tempo.
            </p>
          </div>
        </section>

        <section className="content-section">
          <span className="content-section__label">Metodologia</span>
          <h2 className="content-section__title">Da coleta à catalogação</h2>
          <div className="prose">
            <p>
              Os materiais passam por etapas sucessivas: identificação da procedência,
              descrição arquivística, digitalização em alta resolução e preenchimento
              de metadados padronizados (tipo de acervo, fundo, data de produção,
              suporte, dimensões e descrição de conteúdo).
            </p>
            <p>
              Esse processo garante que cada item seja localizável, contextualizado e
              acessível ao público, respeitando princípios de preservação documental e
              de difusão responsável do patrimônio.
            </p>
          </div>
        </section>

        <div className="content-rule" />

        <section>
          <span className="content-section__label">A equipe em campo</span>
          <h2 className="content-section__title">Quem documentou o acervo</h2>
          <div className="prose">
            <p>
              Registros do trabalho de pesquisa, documentação e digitalização. As
              fotografias dos integrantes durante o processo poderão ser adicionadas
              aqui.
            </p>
          </div>

          <div className="team-grid">
            {EQUIPE_PESQUISA.map((p, i) => (
              <div className="team-member" key={i}>
                <div className="team-member__photo">
                  {p.foto
                    ? <img src={p.foto} alt={p.nome} />
                    : <span className="team-member__initials">{initials(p.nome)}</span>}
                </div>
                <span className="team-member__name">{p.nome}</span>
                <span className="team-member__role">{p.funcao}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
