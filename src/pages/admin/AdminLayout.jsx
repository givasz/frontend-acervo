import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Archive, Layers, Image, LogOut, Home, Settings, Youtube } from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__brand-icon"><Archive size={18}/></div>
          <div>
            <div className="admin-sidebar__brand-title">Acervo</div>
            <div className="admin-sidebar__brand-sub mono">Administração</div>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          <span className="admin-sidebar__nav-label mono">Navegação</span>
          <NavLink to="/admin" end className={({isActive}) => `admin-nav-item ${isActive?'active':''}`}>
            <Home size={16}/> Dashboard
          </NavLink>
          <NavLink to="/admin/colecoes" className={({isActive}) => `admin-nav-item ${isActive?'active':''}`}>
            <Layers size={16}/> Coleções
          </NavLink>
          <NavLink to="/admin/albuns" className={({isActive}) => `admin-nav-item ${isActive?'active':''}`}>
            <Archive size={16}/> Álbuns
          </NavLink>
          <NavLink to="/admin/imagens" className={({isActive}) => `admin-nav-item ${isActive?'active':''}`}>
            <Image size={16}/> Imagens
          </NavLink>
          <NavLink to="/admin/entrevistas" className={({isActive}) => `admin-nav-item ${isActive?'active':''}`}>
            <Youtube size={16}/> Entrevistas
          </NavLink>
        </nav>

        <div className="admin-sidebar__footer">
          <NavLink to="/admin/configuracoes" className={({isActive}) => `admin-nav-item ${isActive?'active':''}`}>
            <Settings size={16}/> Configurações
          </NavLink>
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__user-info">
              <span className="admin-sidebar__user-name">{user?.name}</span>
              <span className="admin-sidebar__user-email mono">{user?.email}</span>
            </div>
            <button className="admin-sidebar__logout" onClick={handleLogout} title="Sair">
              <LogOut size={16}/>
            </button>
          </div>
          <a href="/" target="_blank" className="admin-sidebar__view-site mono">
            ↗ Ver site público
          </a>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
