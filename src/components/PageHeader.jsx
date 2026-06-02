import './PageHeader.css';

/**
 * Cabeçalho padrão das páginas internas.
 *
 * props:
 *  - eyebrow: rótulo pequeno em mono (ex 'Material Complementar')
 *  - title: título principal
 *  - description: parágrafo opcional
 *  - image: URL de imagem de fundo (opcional — usa imagem do acervo como banner)
 */
export default function PageHeader({ eyebrow, title, description, image }) {
  return (
    <header className={`page-header${image ? ' page-header--image' : ''}`}>
      {image && (
        <div className="page-header__bg">
          <img src={image} alt="" draggable={false} />
          <div className="page-header__overlay" />
        </div>
      )}
      <div className="page-header__inner">
        {eyebrow && <span className="page-header__eyebrow mono">{eyebrow}</span>}
        <h1 className="page-header__title">{title}</h1>
        <div className="page-header__rule" />
        {description && <p className="page-header__desc">{description}</p>}
      </div>
    </header>
  );
}
