import { useEffect, useMemo, useState } from 'react';
import Footer from './components/layout/Footer.jsx';
import Header from './components/layout/Header.jsx';
import HomePage from './pages/HomePage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import MachinesPage from './pages/MachinesPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';

const routes = {
  '/': HomePage,
  '/contacto': ContactPage,
  '/servicios': ServicesPage,
  '/maquinarias': MachinesPage
};

function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }

  return pathname || '/';
}

function App() {
  const [currentPath, setCurrentPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    function handleNavigation(event) {
      if (!(event.target instanceof Element)) {
        return;
      }

      const link = event.target.closest('a');

      if (!link || link.target || link.origin !== window.location.origin) {
        return;
      }

      const nextPath = normalizePath(link.pathname);

      if (link.hash && nextPath === currentPath) {
        return;
      }

      if (!routes[nextPath]) {
        return;
      }

      event.preventDefault();
      window.history.pushState({}, '', `${nextPath}${link.hash}`);
      setCurrentPath(nextPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handlePopState() {
      setCurrentPath(normalizePath(window.location.pathname));
    }

    document.addEventListener('click', handleNavigation);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleNavigation);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPath]);

  const Page = useMemo(() => routes[currentPath] || HomePage, [currentPath]);

  return (
    <>
      <Header currentPath={currentPath} />
      <main className="page">
        <Page />
      </main>
      <Footer currentPath={currentPath} />
    </>
  );
}

export default App;
