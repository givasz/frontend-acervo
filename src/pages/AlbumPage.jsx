import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAlbum, getSettings } from '../api';
import { ArrowLeft, ArrowRight, X, ZoomIn, Play, FileText } from 'lucide-react';
import './AlbumPage.css';

const API = import.meta.env.VITE_API_URL || '';

const DEFAULT_FIELDS = [
  { key: 'collection_name', label: 'Coleção', visible: true },
  { key: 'tipo_acervo', label: 'Tipo de Acervo', visible: true },
  { key: 'numero_registro', label: 'Nº de Registro', visible: true },
  { key: 'fundo', label: 'Fundo', visible: true },
  { key: 'funcao', label: 'Função', visible: true },
  { key: 'data_producao', label: 'Data de Produção', visible: true },
  { key: 'local', label: 'Local', visible: true },
  { key: 'genero', label: 'Gênero', visible: true },
  { key: 'tipo_documental', label: 'Tipo Documental', visible: true },
  { key: 'suporte', label: 'Suporte', visible: true },
  { key: 'dimensoes', label: 'Dimensões', visible: true },
  { key: 'autor_producao', label: 'Produtor / Autoria', visible: true },
  { key: 'conteudo', label: 'Conteúdo / Descrição', visible: true },
];

function MetadataPanel({ meta, fieldConfig, customFields }) {
  if (!meta) return null;

  const activeFields = (fieldConfig || DEFAULT_FIELDS);
  const fields = activeFields
    .filter(f => f.visible && f.key !== 'conteudo')
    .map(f => [f.label, meta[f.key]])
    .filter(([, v]) => v);

  const conteudoField = activeFields.find(f => f.key === 'conteudo');
  const conteudo = conteudoField?.visible ? meta.conteudo : null;

  // extra_fields from image
  const allExtras = meta.extra_fields && typeof meta.extra_fields === 'string'
    ? JSON.parse(meta.extra_fields)
    : (meta.extra_fields || []);

  // global custom fields (defined by admin in settings)
  const globalKeys = (customFields || []).map(f => f.key);
  const globalExtras = (customFields || [])
    .map(f => {
      const found = allExtras.find(e => e.key === f.key);
      return found ? [f.label, found.value] : null;
    })
    .filter(Boolean)
    .filter(([, v]) => v);

  // ad-hoc extras (not part of global custom fields)
  const adHocExtras = allExtras.filter(e => !globalKeys.includes(e.key)).filter(e => e.value);

  const tags = meta.tags ? meta.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  if (!fields.length && !conteudo && !globalExtras.length && !adHocExtras.length && !tags.length) return null;

  return (
    <div className="metadata-panel">
      {conteudo && <p className="metadata-conteudo">{conteudo}</p>}
      <div className="metadata-grid">
        {fields.map(([label, value]) => (
          <div key={label} className="metadata-row">
            <span className="metadata-label mono">{label}</span>
            <span className="metadata-value">{value}</span>
          </div>
        ))}
        {globalExtras.map(([label, value]) => (
          <div key={label} className="metadata-row">
            <span className="metadata-label mono">{label}</span>
            <span className="metadata-value">{value}</span>
          </div>
        ))}
        {adHocExtras.map(({ key, value }) => (
          <div key={key} className="metadata-row">
            <span className="metadata-label mono">{key}</span>
            <span className="metadata-value">{value}</span>
          </div>
        ))}
      </div>
      {tags.length > 0 && (
        <div className="metadata-tags-row">
          {tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      )}
    </div>
  );
}

export default function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isHoveringImg, setIsHoveringImg] = useState(false);
  const [fieldConfig, setFieldConfig] = useState(null);
  const [customFields, setCustomFields] = useState([]);

  useEffect(() => {
    getAlbum(id).then(r => setAlbum(r.data)).finally(() => setLoading(false));
    getSettings('metadata_fields').then(r => setFieldConfig(r.data.value)).catch(() => {});
    getSettings('custom_fields').then(r => setCustomFields(r.data.value || [])).catch(() => {});
  }, [id]);

  const openLightbox = (index) => { setLightbox({ open: true, index }); setIsHoveringImg(false); };
  const closeLightbox = () => { setLightbox({ open: false, index: 0 }); setIsHoveringImg(false); };

  const prev = useCallback(() => {
    setIsHoveringImg(false);
    setLightbox(lb => ({ ...lb, index: (lb.index - 1 + album.images.length) % album.images.length }));
  }, [album]);

  const next = useCallback(() => {
    setIsHoveringImg(false);
    setLightbox(lb => ({ ...lb, index: (lb.index + 1) % album.images.length }));
  }, [album]);

  const handleImgMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  useEffect(() => {
    if (!lightbox.open) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox.open, prev, next]);

  if (loading) return (
    <div className="album-page">
      <div className="album-page__header skeleton" style={{height:'220px'}} />
      <div className="gallery-grid" style={{padding:'3rem 2rem'}}>
        {[1,2,3,4,5,6].map(i => <div key={i} className="gallery-item skeleton" style={{height:'200px'}} />)}
      </div>
    </div>
  );

  if (!album) return <div style={{padding:'8rem 2rem',textAlign:'center',color:'var(--ash)'}}>Álbum não encontrado.</div>;

  const currentImg = album.images?.[lightbox.index];

  return (
    <div className="album-page animate-fade">
      <div className="album-page__header">
        <div className="album-page__header-bg">
          {album.cover_image && <img src={`${API}${album.cover_image}`} alt="" />}
          <div className="album-page__header-overlay" />
        </div>
        <div className="album-page__header-content">
          <div className="breadcrumb mono">
            <Link to="/">Início</Link>
            <span>/</span>
            {album.collection_slug && <Link to={`/acervo/${album.collection_slug}`}>{album.collection_name_nav}</Link>}
            <span>/</span>
            <span>{album.title}</span>
          </div>
          <h1 className="album-page__title">{album.title}</h1>
          {album.description && <p className="album-page__desc">{album.description}</p>}
          <span className="mono" style={{fontSize:'0.7rem',color:'var(--sepia)',letterSpacing:'0.1em'}}>
            {album.images?.length || 0} imagens
          </span>
        </div>
      </div>

      <div className="gallery-section">
        {album.images?.length === 0 ? (
          <div className="empty-state"><ZoomIn size={40} opacity={0.2}/><p>Nenhuma imagem neste álbum.</p></div>
        ) : (
          <div className="gallery-grid">
            {album.images?.map((img, i) => (
              <button
                key={img.id}
                className="gallery-item animate-scale"
                style={{animationDelay:`${i*40}ms`}}
                onClick={() => openLightbox(i)}
              >
                {img.media_type === 'video' ? (
                  <video src={`${API}${img.url}`} preload="metadata" muted playsInline />
                ) : img.media_type === 'document' ? (
                  <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'8px',background:'var(--dim)',color:'var(--ash)'}}>
                    <FileText size={36}/>
                    <span className="mono" style={{fontSize:'0.6rem',letterSpacing:'0.08em',textTransform:'uppercase'}}>{img.url.split('.').pop()}</span>
                  </div>
                ) : (
                  <img src={`${API}${img.url}`} alt={img.title || ''} loading="lazy" />
                )}
                <div className="gallery-item__overlay">
                  {img.media_type === 'video' ? <Play size={28} /> : img.media_type === 'document' ? <FileText size={24} /> : <ZoomIn size={24} />}
                  {img.title && <span className="gallery-item__title">{img.title}</span>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox.open && currentImg && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className={`lightbox__inner ${currentImg.media_type === 'document' ? 'lightbox__inner--document' : ''}`} onClick={e => e.stopPropagation()}>

            <div className="lightbox__header">
              <div className="lightbox__title">
                {currentImg.title && <span className="lightbox__img-title">{currentImg.title}</span>}
                <span className="mono lightbox__counter">{lightbox.index + 1} / {album.images.length}</span>
              </div>
              <button className="lightbox__btn" onClick={closeLightbox}><X size={20}/></button>
            </div>

            <div className="lightbox__scroll">

              <div className="lightbox__image-area">
                <button className="lightbox__nav lightbox__nav--prev" onClick={prev}><ArrowLeft size={24}/></button>
                <div
                  className="lightbox__image-wrap"
                  onMouseMove={currentImg.media_type === 'image' ? handleImgMouseMove : undefined}
                  onMouseEnter={currentImg.media_type === 'image' ? () => setIsHoveringImg(true) : undefined}
                  onMouseLeave={currentImg.media_type === 'image' ? () => setIsHoveringImg(false) : undefined}
                  onContextMenu={e => e.preventDefault()}
                >
                  {currentImg.media_type === 'video' ? (
                    <video
                      key={currentImg.id}
                      src={`${API}${currentImg.url}`}
                      controls
                      autoPlay
                      className="lightbox__video"
                    />
                  ) : currentImg.media_type === 'document' ? (
                    <iframe
                      key={currentImg.id}
                      src={`${API}${currentImg.url}`}
                      title={currentImg.title || 'Documento'}
                      className="lightbox__document"
                    />
                  ) : (
                    <img
                      src={`${API}${currentImg.url}`}
                      alt={currentImg.title || ''}
                      draggable={false}
                      style={{
                        transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                        transform: isHoveringImg ? 'scale(2.5)' : 'scale(1)',
                        cursor: isHoveringImg ? 'crosshair' : 'zoom-in',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </div>
                <button className="lightbox__nav lightbox__nav--next" onClick={next}><ArrowRight size={24}/></button>
              </div>

              <div className="lightbox__meta">
                <MetadataPanel meta={currentImg} fieldConfig={fieldConfig} customFields={customFields} />
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
