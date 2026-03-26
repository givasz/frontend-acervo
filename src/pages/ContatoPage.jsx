import { useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';

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
            background: 'var(--panel)', border: '1px solid rgba(200,169,110,0.2)',
            color: 'var(--parchment)', fontFamily: 'var(--font-body)', fontSize: '0.95rem',
            padding: '12px 14px', resize: 'vertical', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(200,169,110,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(200,169,110,0.2)'}
        />
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          style={{
            background: 'var(--panel)', border: '1px solid rgba(200,169,110,0.2)',
            color: 'var(--parchment)', fontFamily: 'var(--font-body)', fontSize: '0.95rem',
            padding: '12px 14px', outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(200,169,110,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(200,169,110,0.2)'}
        />
      )}
    </div>
  );

  return (
    <div style={{ minHeight: '80vh', padding: '5rem 2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <p className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--sepia)', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Contato
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '1.5rem', color: 'var(--parchment)' }}>
          Entre em Contato
        </h1>
        <div className="divider" style={{ maxWidth: '120px', marginBottom: '3rem' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '4rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--fog)', lineHeight: 1.8, fontSize: '1rem' }}>
                Tem dúvidas, sugestões ou quer contribuir com o acervo? Entre em contato conosco.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--fog)' }}>
                <Mail size={16} style={{ color: 'var(--sepia)', marginTop: '3px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--sepia)', marginBottom: '3px' }}>E-mail</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem' }}>contato@acervomariaconceicao.com.br</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {field('Nome', 'nome')}
              {field('E-mail', 'email', 'email')}
            </div>
            {field('Assunto', 'assunto')}
            {field('Mensagem', 'mensagem', 'text', 6)}
            <div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Send size={14} />
                {enviado ? 'Abrindo cliente de e-mail...' : 'Enviar Mensagem'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
