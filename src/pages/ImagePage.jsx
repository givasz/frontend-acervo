import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getImage } from '../api';
import { ArrowLeft, Tag } from 'lucide-react';
import './ImagePage.css';

const API = import.meta.env.VITE_API_URL || '';

export default function ImagePage() {
  const { id } = useParams();
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getImage(id).then(r => setImg(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="image-page">
      <div className="image-page__layout">
        <div className="skeleton" style={{height:'600px',flex:1}} />
        <div className="image-page__info skeleton" style={{height:'600px',width:'360px'}} />
      </div>
    </div>
  );

  if (!img) return <div style={{padding:'8rem 2rem',textAlign:'center',color:'var(--ash)'}}>Imagem não encontrada.</div>;

  const metaFields = [
    ['Coleção', img.collection_name],
    ['Tipo de Acervo', img.tipo_acervo],
    ['Nº de Registro', img.numero_registro],
    ['Fundo', img.fundo],
    ['Função', img.funcao],
    ['Data de Produção', img.data_producao],
    ['Local', img.local],
    ['Gênero', img.genero],
    ['Tipo Documental', img.tipo_documental],
    ['Suporte', img.suporte],
    ['Dimensões', img.dimensoes],
    ['Produtor / Autoria', img.autor_producao],
  ].filter(([,v]) => v);

  const extras = img.extra_fields && typeof img.extra_fields === 'string'
    ? JSON.parse(img.extra_fields)
    : (img.extra_fields || []);

  const tags = img.tags ? img.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="image-page animate-fade">
      <div className="image-page__breadcrumb">
        <Link to="/">Início</Link>
        {img.collection_slug && <><span>/</span><Link to={`/acervo/${img.collection_slug}`}>{img.collection_name_nav}</Link></>}
        {img.album_id && <><span>/</span><Link to={`/album/${img.album_id}`}>{img.album_title}</Link></>}
        <span>/</span><span>{img.title || 'Imagem'}</span>
      </div>

      <div className="image-page__layout">
        <div className="image-page__viewer">
          {img.media_type === 'document' ? (
            <iframe
              src={`${API}${img.url}`}
              title={img.title || 'Documento'}
              style={{width:'100%',height:'100%',minHeight:'600px',border:'none',background:'#fff'}}
            />
          ) : (
            <img src={`${API}${img.url}`} alt={img.title || ''} />
          )}
        </div>

        <aside className="image-page__info">
          {img.title && <h1 className="image-page__title">{img.title}</h1>}

          <div className="divider" />

          {metaFields.map(([label, value]) => (
            <div key={label} className="image-page__field">
              <span className="image-page__field-label mono">{label}</span>
              <span className="image-page__field-value">{value}</span>
            </div>
          ))}

          {extras.map(({ key, value }) => (
            <div key={key} className="image-page__field">
              <span className="image-page__field-label mono">{key}</span>
              <span className="image-page__field-value">{value}</span>
            </div>
          ))}

          {img.conteudo && (
            <div className="image-page__content">
              <span className="image-page__field-label mono">Conteúdo</span>
              <p className="image-page__content-text">{img.conteudo}</p>
            </div>
          )}

          {tags.length > 0 && (
            <div className="image-page__tags-section">
              <span className="image-page__field-label mono" style={{display:'flex',alignItems:'center',gap:'6px'}}>
                <Tag size={12}/> Tags
              </span>
              <div className="image-page__tags">
                {tags.map(t => (
                  <Link key={t} to={`/busca?q=${encodeURIComponent(t)}`} className="tag">{t}</Link>
                ))}
              </div>
            </div>
          )}

          <div className="divider" />
          {img.album_id && (
            <Link to={`/album/${img.album_id}`} className="btn btn-ghost btn-sm" style={{width:'100%',justifyContent:'center'}}>
              <ArrowLeft size={14}/> Voltar ao álbum
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}
