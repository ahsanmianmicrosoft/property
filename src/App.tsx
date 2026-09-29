import React, { useState, useEffect } from 'react';
import { RealEstateProvider, useRealEstate } from './context/RealEstateContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CompareDrawer } from './components/CompareDrawer';
import { AuthModal } from './components/AuthModal';
import { AdminLoginGate } from './components/AdminLoginGate';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { AgentsPage } from './pages/AgentsPage';
import { AgentDetailsPage } from './pages/AgentDetailsPage';
import { ComparePage } from './pages/ComparePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { PostPropertyPage } from './pages/PostPropertyPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { CMSPages } from './pages/CMSPages';
import { ProfilePage } from './pages/ProfilePage';
import { CustomerPortalPage } from './pages/CustomerPortalPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useRealEstate();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-xl shadow-lg border flex items-start gap-2.5 text-xs animate-in slide-in-from-top-2 fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
              : toast.type === 'error'
              ? 'bg-rose-950 text-rose-100 border-rose-800'
              : 'bg-slate-900 text-slate-100 border-slate-700'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <span className="flex-1 font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white shrink-0 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentUser, isStaff, isAuthModalOpen, closeAuthModal } = useRealEstate();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Simple clean client-side routing
  const renderPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage navigate={navigate} />;
    }
    if (currentPath === '/customer') {
      return <CustomerPortalPage navigate={navigate} />;
    }
    if (currentPath === '/properties') {
      return <PropertiesPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/properties/')) {
      const slug = currentPath.replace('/properties/', '');
      return <PropertyDetailsPage slug={slug} navigate={navigate} />;
    }
    if (currentPath === '/projects') {
      return <ProjectsPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/projects/')) {
      const slug = currentPath.replace('/projects/', '');
      return <ProjectDetailsPage slug={slug} navigate={navigate} />;
    }
    if (currentPath === '/agents') {
      return <AgentsPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/agents/')) {
      const slug = currentPath.replace('/agents/', '');
      return <AgentDetailsPage slug={slug} navigate={navigate} />;
    }
    if (currentPath === '/compare') {
      return <ComparePage navigate={navigate} />;
    }
    if (currentPath === '/favorites') {
      return <FavoritesPage navigate={navigate} />;
    }
    if (currentPath === '/post-property') {
      return <PostPropertyPage navigate={navigate} />;
    }
    if (currentPath === '/blog') {
      return <BlogPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '');
      return <BlogPostPage slug={slug} navigate={navigate} />;
    }
    if (currentPath === '/about') {
      return <CMSPages type="about" navigate={navigate} />;
    }
    if (currentPath === '/services') {
      return <CMSPages type="services" navigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <CMSPages type="contact" navigate={navigate} />;
    }
    if (currentPath === '/profile') {
      return currentUser.role === 'CUSTOMER' || currentUser.role === 'GUEST' ? (
        <CustomerPortalPage navigate={navigate} />
      ) : (
        <ProfilePage navigate={navigate} />
      );
    }
    if (currentPath === '/admin') {
      // Protected Route: Only authenticated staff can view Admin CRM
      if (!isStaff) {
        return (
          <AdminLoginGate
            navigate={navigate}
            onLoginSuccess={() => {
              navigate('/admin');
            }}
          />
        );
      }
      return <AdminDashboard navigate={navigate} />;
    }

    return <HomePage navigate={navigate} />;
  };

  const isAdminView = currentPath === '/admin' && isStaff;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-white">
      {!isAdminView && <Navbar currentPath={currentPath} navigate={navigate} />}
      <ToastContainer />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onSuccess={() => {
          if (isStaff) navigate('/admin');
        }}
      />
      <div className="flex-1">{renderPage()}</div>
      {!isAdminView && <CompareDrawer navigate={navigate} />}
      {!isAdminView && <Footer navigate={navigate} />}
    </div>
  );
};

export default function App() {
  return (
    <RealEstateProvider>
      <AppContent />
    </RealEstateProvider>
  );
}
