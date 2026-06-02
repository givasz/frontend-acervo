import { useState } from 'react';
import { Send, Instagram } from 'lucide-react';

const SOCIAL = [
  { icon: Instagram, label: '@nome.do.perfil' },
  { icon: Instagram, label: '@nome.do.perfil' },
  { icon: Instagram, label: '@nome.do.perfil' },
];

export default function ContatoPage() {
  const [form, setForm] = useState({ nome: '', email: '', assunto: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nome, email, assunto, mensagem } = form;
    const mailto = `mailto:contato@acervomariaconceicao.com.br?subject=${encodeURIComponent(assunto || 'Contato via site')}&body=${encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\n${mensagem}`)}`;
    window.location.href = mailto;
    setEnviado(true);
  };

  const field = (label, key, type = 'text', rows) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--sepia)' }}>
        {label}
      </label>
      {rows ? (
        <textarea
          rows={rows}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          style={{
            background: 'var(--dim)', border: '1px solid #d4cec4',
            color: 'var(--parchment)', fontFamily: 'var(--font-body)', fontSize: '0.95rem',
            padding: '12px 14px', resize: 'vertical', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--sepia)'}
          onBlur={e => e.target.style.borderColor = '#d4cec4'}
        />
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          style={{
            background: 'var(--dim)', border: '1px solid #d4cec4',
            color: 'var(--parchment)', fontFamily: 'var(--font-body)', fontSize: '0.95rem',
            padding: '12px 14px', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--sepia)'}
          onBlur={e => e.target.style.borderColor = '#d4cec4'}
        />
      )}
    </div>
  );

  return (
    <div style={{ minHeight: '80vh', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto'  }}>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(2rem,4vw,3rem)',
          color: '#2f0d13',
          marginBottom: '2rem',
        }}>
          Contato
        </h1>

        {/* Redes sociais */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '3rem' }}>
          {SOCIAL.map(({ icon: Icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Icon size={18} strokeWidth={1.5} style={{ color: '#2f0d13', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', letterSpacing: '0.05em', color: 'var(--fog)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {field('Nome', 'nome')}
            {field('E-mail', 'email', 'email')}
          </div>
          {field('Assunto', 'assunto')}
          {field('Mensagem', 'mensagem', 'text', 6)}
          <div>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={14} />
              {enviado ? 'Abrindo cliente de e-mail...' : 'Enviar Mensagem'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
