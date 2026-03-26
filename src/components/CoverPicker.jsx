import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

export default function CoverPicker({ value, onChange, label = 'Imagem de Capa' }) {
  const ref = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) onChange(file);
  };

  const preview = value instanceof File
    ? URL.createObjectURL(value)
    : value ? `${API}${value}` : null;

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />

      {preview ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={preview}
            alt="capa"
            style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block', cursor: 'pointer', border: '1px solid #2e2a25' }}
            onClick={() => ref.current?.click()}
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            style={{
              position: 'absolute', top: 6, right: 6,
              background: 'rgba(14,12,10,0.8)', border: '1px solid #3a3530',
              color: 'var(--fog)', padding: '4px', display: 'flex', alignItems: 'center', cursor: 'pointer',
            }}
            title="Remover capa"
          >
            <X size={14} />
          </button>
          <span
            className="mono"
            style={{ display: 'block', fontSize: '0.62rem', color: 'var(--ash)', letterSpacing: '0.08em', marginTop: 6, cursor: 'pointer' }}
            onClick={() => ref.current?.click()}
          >
            Clique na imagem para trocar
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 8, width: '100%', padding: '28px 0',
            border: '1px dashed #3a3530', color: 'var(--ash)',
            cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--sepia)'; e.currentTarget.style.color = 'var(--sepia)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#3a3530'; e.currentTarget.style.color = 'var(--ash)'; }}
        >
          <ImagePlus size={22} />
          <span className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>Selecionar imagem de capa</span>
        </button>
      )}
    </div>
  );
}
