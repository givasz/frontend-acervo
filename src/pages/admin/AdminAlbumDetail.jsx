import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAlbum, uploadImages, updateImage, updateImageMetadata, deleteImage, getSettings, updateAlbum, uploadCover } from '../../api';
import { Upload, Edit2, Trash2, X, Plus, Save, ChevronLeft, ImagePlus, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminAlbumDetail.css';

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

export default function AdminAlbumDetail() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingImg, setEditingImg] = useState(null);
  const [meta, setMeta] = useState({});
  const [savingMeta, setSavingMeta] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fieldConfig, setFieldConfig] = useState(DEFAULT_FIELDS);
  const [customFields, setCustomFields] = useState([]);
  const fileRef = useRef();
  const coverRef = useRef();

  const handleCoverUpload = async (file) => {
    if (!file) return;
    try {
      const up = await uploadCover(file, 'album', id);
      setAlbum(a => ({ ...a, cover_image: up.data.url }));
      toast.success('Capa do álbum atualizada!');
    } catch { toast.error('Erro ao atualizar capa'); }
  };

  const load = () => getAlbum(id).then(r => {
    setAlbum(r.data);
    setImages(r.data.images || []);
  }).finally(() => setLoading(false));

  useEffect(() => {
    load();
    getSettings('metadata_fields')
      .then(r => { if (r.data.value) setFieldConfig(r.data.value); })
      .catch(() => {});
    getSettings('custom_fields')
      .then(r => setCustomFields(r.data.value || []))
      .catch(() => {});
  }, [id]);

  const visibleFields = fieldConfig.filter(f => f.visible);
  const standardFields = visibleFields.filter(f => f.key !== 'conteudo');
  const hasConteudo = visibleFields.some(f => f.key === 'conteudo');

  const buildEmptyMeta = () =>
    fieldConfig.reduce((a, f) => ({ ...a, [f.key]: '' }), { title: '', extra_fields: [] });

  const openMeta = (img) => {
    setEditingImg(img);
    const allExtras = img.extra_fields
      ? (typeof img.extra_fields === 'string' ? JSON.parse(img.extra_fields) : img.extra_fields)
      : [];
    const globalKeys = customFields.map(f => f.key);
    // values for global custom fields
    const customValues = Object.fromEntries(
      customFields.map(f => {
        const found = allExtras.find(e => e.key === f.key);
        return [f.key, found ? found.value : ''];
      })
    );
    // ad-hoc extras (not part of global custom fields)
    const adHocExtras = allExtras.filter(e => !globalKeys.includes(e.key));
    setMeta({
      ...buildEmptyMeta(),
      ...Object.fromEntries(fieldConfig.map(f => [f.key, img[f.key] || ''])),
      title: img.title || '',
      tags: img.tags || '',
      customValues,
      extra_fields: adHocExtras,
    });
  };

  const handleUpload = async (files) => {
    if (!files?.length) return;
    setUploading(true); setUploadProgress(0);
    try {
      await uploadImages(id, Array.from(files), (e) => {
        if (e.total) setUploadProgress(Math.round((e.loaded / e.total) * 100));
      });
      toast.success(`${files.length} arquivo(s) enviado(s)!`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro no upload');
    } finally { setUploading(false); setUploadProgress(0); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleSaveMeta = async () => {
    setSavingMeta(true);
    try {
      await updateImage(editingImg.id, { title: meta.title || editingImg.title });
      // merge global custom field values + ad-hoc extras into extra_fields
      const globalExtras = customFields
        .map(f => ({ key: f.key, value: meta.customValues?.[f.key] || '' }))
        .filter(e => e.value);
      const allExtras = [...globalExtras, ...(meta.extra_fields || [])];
      await updateImageMetadata(editingImg.id, { ...meta, extra_fields: allExtras });
      toast.success('Metadados salvos!');
      load();
    } catch (err) {
      toast.error('Erro ao salvar metadados');
    } finally { setSavingMeta(false); }
  };

  const handleDeleteImg = async (img) => {
    if (!confirm('Excluir esta imagem?')) return;
    try { await deleteImage(img.id); toast.success('Imagem removida'); load(); }
    catch { toast.error('Erro ao remover'); }
  };

  const handleSetCover = async (img) => {
    try {
      await updateAlbum(id, { cover_image: img.url });
      setAlbum(a => ({ ...a, cover_image: img.url }));
      toast.success('Capa do álbum atualizada!');
    } catch { toast.error('Erro ao definir capa'); }
  };

  const addExtraField = () => setMeta(m => ({ ...m, extra_fields: [...m.extra_fields, { key: '', value: '' }] }));
  const updateExtra = (i, field, val) => setMeta(m => {
    const arr = [...m.extra_fields];
    arr[i] = { ...arr[i], [field]: val };
    return { ...m, extra_fields: arr };
  });
  const removeExtra = (i) => setMeta(m => ({ ...m, extra_fields: m.extra_fields.filter((_, idx) => idx !== i) }));

  if (loading) return <div className="admin-loading" style={{padding:'4rem'}}>Carregando álbum...</div>;

  return (
    <div className="admin-album-detail">
      <div className="admin-page-header">
        <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
          {/* Cover thumbnail inline */}
          <div style={{position:'relative',flexShrink:0}}>
            <input ref={coverRef} type="file" accept="image/*" style={{display:'none'}} onChange={e => e.target.files[0] && handleCoverUpload(e.target.files[0])} />
            <div
              onClick={() => coverRef.current?.click()}
              title="Clique para trocar a capa"
              style={{
                width:80, height:80, flexShrink:0, cursor:'pointer',
                border:'1px solid #3a3530', position:'relative', overflow:'hidden',
                background:'var(--dim)',
              }}
            >
              {album?.cover_image
                ? <img src={`${API}${album.cover_image}`} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
                : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--ash)'}}><ImagePlus size={22}/></div>
              }
              <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.45)',display:'flex',alignItems:'center',justifyContent:'center',opacity:0,transition:'opacity 0.2s'}}
                onMouseEnter={e=>e.currentTarget.style.opacity=1}
                onMouseLeave={e=>e.currentTarget.style.opacity=0}
              >
                <ImagePlus size={18} color="white"/>
              </div>
            </div>
          </div>
          <div>
            <Link to="/admin/albuns" className="back-link mono" style={{marginBottom:'8px',display:'inline-flex',alignItems:'center',gap:'6px',fontSize:'0.68rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--ash)'}}>
              <ChevronLeft size={13}/> Álbuns
            </Link>
            <h1 className="admin-page-title">{album?.title}</h1>
            <p className="admin-page-sub mono">{images.length} imagem(ns) · {album?.collection_name}</p>
          </div>
        </div>
      </div>

      {/* Upload zone */}
      <div className="upload-section">
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" multiple accept="image/*,video/*,application/pdf,image/tiff" style={{display:'none'}} onChange={e => handleUpload(e.target.files)} />
          <Upload size={32} />
          <p className="upload-zone__text">Arraste arquivos aqui ou <span>clique para selecionar</span></p>
          <p className="mono upload-zone__hint">Imagens (JPG, PNG, WEBP) · Vídeos (MP4, MOV, WEBM) · Documentos (PDF, TIFF) · Máx. 500MB</p>
          {uploading && (
            <div className="upload-progress">
              <div className="upload-progress__bar" style={{width:`${uploadProgress}%`}} />
              <span className="mono">{uploadProgress}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Images grid */}
      <div className="admin-images-section">
        <h2 className="admin-images-section__title">Arquivos do Álbum</h2>
        {images.length === 0 ? (
          <div className="admin-empty"><p>Nenhum arquivo. Faça upload acima.</p></div>
        ) : (
          <div className="admin-images-grid">
            {images.map(img => {
              const isCover = album?.cover_image === img.url;
              return (
                <div key={img.id} className={`admin-img-card ${isCover ? 'admin-img-card--cover' : ''}`}>
                  <div className="admin-img-card__thumb">
                    {img.media_type === 'video' ? (
                      <video src={`${API}${img.url}`} preload="metadata" muted />
                    ) : img.media_type === 'document' ? (
                      <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'6px',background:'var(--dim)',color:'var(--ash)'}}>
                        <FileText size={32}/>
                        <span className="mono" style={{fontSize:'0.6rem',letterSpacing:'0.08em',textTransform:'uppercase'}}>{img.url.split('.').pop()}</span>
                      </div>
                    ) : (
                      <img src={`${API}${img.url}`} alt={img.title || ''} loading="lazy" />
                    )}
                    {isCover && (
                      <span className="admin-img-card__cover-badge mono">Capa</span>
                    )}
                    <div className="admin-img-card__actions">
                      <button className="admin-action-btn" onClick={() => openMeta(img)} title="Editar metadados">
                        <Edit2 size={14}/>
                      </button>
                      <button
                        className={`admin-action-btn ${isCover ? 'admin-action-btn--active' : ''}`}
                        onClick={() => handleSetCover(img)}
                        title="Definir como capa do álbum"
                      >
                        <ImagePlus size={14}/>
                      </button>
                      <button className="admin-action-btn admin-action-btn--danger" onClick={() => handleDeleteImg(img)} title="Excluir">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                  <div className="admin-img-card__info">
                    <span className="admin-img-card__title">{img.title || 'Sem título'}</span>
                    {img.tipo_acervo && <span className="mono admin-img-card__meta">{img.tipo_acervo}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Metadata modal */}
      {editingImg && (
        <div className="modal-backdrop" onClick={() => setEditingImg(null)}>
          <div className="modal modal--wide animate-scale" onClick={e => e.stopPropagation()}>
            <div className="modal__header" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <h2 className="modal__title">{editingImg.media_type === 'document' ? 'Metadados do Documento' : 'Metadados da Imagem'}</h2>
              <button className="admin-action-btn" onClick={() => setEditingImg(null)}><X size={16}/></button>
            </div>
            <div className="meta-editor">
              <div className="meta-editor__preview">
                {editingImg.media_type === 'document' ? (
                  <iframe
                    src={`${API}${editingImg.url}`}
                    title={editingImg.title || 'Documento'}
                  />
                ) : (
                  <img src={`${API}${editingImg.url}`} alt="" />
                )}
              </div>
              <div className="meta-editor__form">
                <div className="form-group">
                  <label className="form-label">Título da imagem</label>
                  <input className="form-input" value={meta.title ?? ''} onChange={e => setMeta(m => ({...m, title: e.target.value}))} />
                </div>

                {standardFields.length > 0 && (
                  <>
                    <div className="meta-editor__divider mono">Campos de Metadados</div>
                    <div className="meta-fields-grid">
                      {standardFields.map(f => (
                        <div key={f.key} className="form-group">
                          <label className="form-label">{f.label}</label>
                          <input className="form-input" value={meta[f.key] || ''} onChange={e => setMeta(m => ({...m, [f.key]: e.target.value}))} />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {hasConteudo && (
                  <div className="form-group">
                    <label className="form-label">
                      {fieldConfig.find(f => f.key === 'conteudo')?.label || 'Conteúdo / Descrição'}
                    </label>
                    <textarea className="form-input" rows={4} value={meta.conteudo || ''} onChange={e => setMeta(m => ({...m, conteudo: e.target.value}))} />
                  </div>
                )}

                {customFields.length > 0 && (
                  <>
                    <div className="meta-editor__divider mono">Campos Personalizados do Acervo</div>
                    <div className="meta-fields-grid">
                      {customFields.map(f => (
                        <div key={f.key} className="form-group">
                          <label className="form-label">{f.label}</label>
                          <input
                            className="form-input"
                            value={meta.customValues?.[f.key] || ''}
                            onChange={e => setMeta(m => ({ ...m, customValues: { ...m.customValues, [f.key]: e.target.value } }))}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label className="form-label">Tags (separadas por vírgula)</label>
                  <input className="form-input" value={meta.tags || ''} onChange={e => setMeta(m => ({...m, tags: e.target.value}))} placeholder="arquitetura, cinema, 1940..." />
                </div>

                <div className="meta-editor__divider mono">
                  Campos Extras por Imagem
                  <button className="btn btn-ghost btn-sm" style={{marginLeft:'auto'}} onClick={addExtraField}><Plus size={13}/> Adicionar campo</button>
                </div>

                {meta.extra_fields?.map((ef, i) => (
                  <div key={i} className="extra-field-row">
                    <input className="form-input" placeholder="Nome do campo" value={ef.key} onChange={e => updateExtra(i, 'key', e.target.value)} style={{flex:'0 0 200px'}} />
                    <input className="form-input" placeholder="Valor" value={ef.value} onChange={e => updateExtra(i, 'value', e.target.value)} style={{flex:1}} />
                    <button className="admin-action-btn admin-action-btn--danger" onClick={() => removeExtra(i)}><X size={14}/></button>
                  </div>
                ))}

                <div className="modal__footer">
                  <button className="btn btn-ghost" onClick={() => setEditingImg(null)}>Fechar</button>
                  <button className="btn btn-primary" onClick={handleSaveMeta} disabled={savingMeta}>
                    <Save size={15}/> {savingMeta ? 'Salvando...' : 'Salvar Metadados'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
