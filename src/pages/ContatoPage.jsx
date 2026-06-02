import { useState } from 'react';
import { Send, Instagram, Mail } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import useAcervoImages from '../hooks/useAcervoImages';
import './content.css';
import './ContatoPage.css';

const SOCIAL = [
  { icon: Instagram, label: '@nome.do.perfil', href: '#' },
  { icon: Instagram, label: '@nome.do.perfil', href: '#' },
];

const EMAIL = 'contato@acervomariaconceicao.com.br';

export default function ContatoPage() {
  const [form, setForm] = useState({ nome: '', email: '', assunto: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);
  const { bannerAt } = useAcervoImages();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nome, email, assunto, mensagem } = form;
    const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(assunto || 'Contato via site')}&body=${encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\n${mensagem}`)}`;
    window.location.href = mailto;
    setEnviado(true);
  };

  const field = (label, key, type = 'text', rows) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {rows ? (
        <textarea
          className="form-input"
          rows={rows}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        />
      ) : (
        <input
          className="form-input"
          type={type}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        />
      )}
    </div>
  );

  return (
    <div className="animate-fade">
      <PageHeader
        eyebrow="Acervo"
        title="Contato"
        description="Fale com a equipe do acervo para dúvidas, colaborações, doação de materiais ou pesquisa."
        image={bannerAt(8)}
      />

      <div className="content">
        <div className="contato-grid">
          {/* Coluna de informações */}
          <aside className="contato-info">
            <div className="contato-info__block">
              <span className="content-section__label">E-mail</span>
              <a className="contato-info__email" href={`mailto:${EMAIL}`}>
                <Mail size={16} /> {EMAIL}
              </a>
            </div>

            <div className="contato-info__block">
              <span className="content-section__label">Redes sociais</span>
              <div className="contato-info__social">
                {SOCIAL.map(({ icon: Icon, label, href }, i) => (
                  <a key={i} href={href} className="contato-info__social-item">
                    <Icon size={18} strokeWidth={1.5} />
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="contato-form">
            <div className="contato-form__row">
              {field('Nome', 'nome')}
              {field('E-mail', 'email', 'email')}
            </div>
            {field('Assunto', 'assunto')}
            {field('Mensagem', 'mensagem', 'text', 6)}
            <div>
              <button type="submit" className="btn btn-primary">
                <Send size={14} />
                {enviado ? 'Abrindo cliente de e-mail...' : 'Enviar mensagem'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
