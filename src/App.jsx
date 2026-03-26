import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import CollectionPage from './pages/CollectionPage';
import AlbumPage from './pages/AlbumPage';
import ImagePage from './pages/ImagePage';
import SearchPage from './pages/SearchPage';
import CatalogacaoPage from './pages/CatalogacaoPage';
import EntrevistasPage from './pages/EntrevistasPage';
import EntrevistaDetailPage from './pages/EntrevistaDetailPage';
import ProducoesAcademicasPage from './pages/ProducoesAcademicasPage';
import EquipePage from './pages/EquipePage';
import ContatoPage from './pages/ContatoPage';

import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminCollections from './pages/admin/AdminCollections';
import AdminCollectionDetail from './pages/admin/AdminCollectionDetail';
import AdminAlbums from './pages/admin/AdminAlbums';
import AdminAlbumDetail from './pages/admin/AdminAlbumDetail';
import AdminImages from './pages/admin/AdminImages';
import AdminSettings from './pages/admin/AdminSettings';
import AdminEntrevistas from './pages/admin/AdminEntrevistas';

function SobrePage() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '700px', textAlign: 'center' }}>
        <p className="mono" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--sepia)', textTransform: 'uppercase', marginBottom: '1rem' }}>A Coleção</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: '2rem' }}>
          Sobre o Acervo<br />Maria da Conceição
        </h1>
        <div className="divider" style={{ maxWidth: '120px', margin: '0 auto 2rem' }} />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--fog)', lineHeight: 1.8 }}>
          Este acervo é dedicado à preservação e difusão da memória histórica,
          reunindo documentos, fotografias e registros que contam histórias
          através do tempo. Uma coleção viva, em constante crescimento.
        </p>
      </div>
    </div>
  );
}

function PublicWrapper() {
  useEffect(() => {
    const noContext = (e) => {
      if (e.target.tagName === 'IMG' || e.target.closest('.gallery-item, .lightbox__image-wrap, .home-card__cover, .album-header-bg')) {
        e.preventDefault();
      }
    };
    const noDrag = (e) => {
      if (e.target.tagName === 'IMG') e.preventDefault();
    };
    document.addEventListener('contextmenu', noContext);
    document.addEventListener('dragstart', noDrag);
    return () => {
      document.removeEventListener('contextmenu', noContext);
      document.removeEventListener('dragstart', noDrag);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '72px', minHeight: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/acervo/:slug" element={<CollectionPage />} />
            <Route path="/album/:id" element={<AlbumPage />} />
            <Route path="/imagem/:id" element={<ImagePage />} />
            <Route path="/busca" element={<SearchPage />} />
            <Route path="/sobre" element={<SobrePage />} />
            <Route path="/catalogacao" element={<CatalogacaoPage />} />
            <Route path="/material-complementar/entrevistas" element={<EntrevistasPage />} />
            <Route path="/material-complementar/entrevistas/:id" element={<EntrevistaDetailPage />} />
            <Route path="/material-complementar/producoes-academicas" element={<ProducoesAcademicasPage />} />
            <Route path="/equipe" element={<EquipePage />} />
            <Route path="/contato" element={<ContatoPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#221e19',
              color: '#f5f0e8',
              border: '1px solid rgba(200,169,110,0.2)',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.8rem',
              letterSpacing: '0.04em',
            },
            success: { iconTheme: { primary: '#5aa67a', secondary: '#0e0c0a' } },
            error: { iconTheme: { primary: '#c44e25', secondary: '#0e0c0a' } },
          }}
        />
        <Routes>
          {/* Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="colecoes" element={<AdminCollections />} />
                    <Route path="colecoes/:id" element={<AdminCollectionDetail />} />
                    <Route path="albuns" element={<AdminAlbums />} />
                    <Route path="albuns/:id" element={<AdminAlbumDetail />} />
                    <Route path="imagens" element={<AdminImages />} />
                    <Route path="entrevistas" element={<AdminEntrevistas />} />
                    <Route path="configuracoes" element={<AdminSettings />} />
                  </Route>
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Public */}
          <Route path="/*" element={<PublicWrapper />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
