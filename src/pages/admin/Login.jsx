import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../api';
import { Link } from 'react-router-dom';
import { Lock, Mail, Archive, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import './Login.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      toast.success(`Bem-vindo, ${res.data.user.name}`);
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__bg" />
      <div className="login-card animate-scale">
        <div className="login-card__header">
          <div className="login-card__icon"><Archive size={24} /></div>
          <h1 className="login-card__title">Acervo</h1>
          <p className="login-card__subtitle">Maria da Conceição</p>
          <p className="mono login-card__label">Painel Administrativo</p>
        </div>
        <form onSubmit={handleSubmit} className="login-card__form">
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <div style={{position:'relative'}}>
              <Mail size={16} style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'var(--ash)'}} />
              <input
                type="email"
                className="form-input"
                style={{paddingLeft:'42px'}}
                value={form.email}
                onChange={e => setForm(f => ({...f, email: e.target.value}))}
                placeholder="admin@acervo.com"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <div style={{position:'relative'}}>
              <Lock size={16} style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',color:'var(--ash)'}} />
              <input
                type="password"
                className="form-input"
                style={{paddingLeft:'42px'}}
                value={form.password}
                onChange={e => setForm(f => ({...f, password: e.target.value}))}
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:'8px'}} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="login-card__hint mono">admin@acervo.com / admin123</p>
        <Link to="/" className="mono" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',fontSize:'0.68rem',letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--ash)',marginTop:'16px',textDecoration:'none'}}>
          <ArrowLeft size={12}/> Voltar ao site
        </Link>
      </div>
    </div>
  );
}
