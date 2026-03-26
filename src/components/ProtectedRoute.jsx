import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--ash)',fontFamily:'var(--font-mono)',fontSize:'0.75rem',letterSpacing:'0.1em',textTransform:'uppercase'}}>
      Carregando...
    </div>
  );

  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}
