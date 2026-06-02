import PageHeader from '../components/PageHeader';
import useAcervoImages from '../hooks/useAcervoImages';
import './content.css';

export default function CatalogacaoPage() {
  const { bannerAt } = useAcervoImages();

  return (
    <div className="animate-fade">
      <PageHeader
        eyebrow="Acervo"
        title="Catalogação"
        description="Como cada item do acervo é descrito, organizado e tornado acessível."
        image={bannerAt(4)}
      />

      <div className="content content-narrow">
        <section className="content-section" style={{ marginTop: '2.5rem' }}>
          <span className="content-section__label">O que é</span>
          <h2 className="content-section__title">Descrição e organização documental</h2>
          <div className="prose">
            <p>
              A catalogação é o processo pelo qual cada documento, fotografia ou
              registro do acervo recebe uma descrição padronizada. É ela que permite
              localizar, contextualizar e preservar o significado de cada item ao longo
              do tempo.
            </p>
            <p>
              Cada peça é registrada com informações sobre sua procedência, natureza e
              estado, formando um conjunto coerente e pesquisável.
            </p>
          </div>
        </section>

        <section className="content-section">
          <span className="content-section__label">Campos descritivos</span>
          <h2 className="content-section__title">O que registramos</h2>
          <div className="prose">
            <p>
              Entre as informações catalogadas estão o tipo de acervo, o fundo a que
              pertence, a data de produção, o suporte e as dimensões, a autoria ou
              produção, o gênero e o tipo documental, além de uma descrição de conteúdo
              e palavras-chave que facilitam a busca.
            </p>
            <p>
              Esse padrão segue princípios da descrição arquivística, garantindo
              consistência entre coleções e álbuns diferentes.
            </p>
          </div>
        </section>

        <section className="content-section">
          <span className="content-section__label">Acesso</span>
          <h2 className="content-section__title">Do arquivo ao público</h2>
          <div className="prose">
            <p>
              Após a digitalização e o preenchimento dos metadados, os itens tornam-se
              disponíveis para consulta nas coleções e álbuns do acervo, sempre
              acompanhados de suas fichas descritivas.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
