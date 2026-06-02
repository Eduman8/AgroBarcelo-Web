import { useEffect, useMemo, useState } from 'react';
import { fallbackRoute, routes } from '../config/routes.jsx';

function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }

  return pathname || '/';
}

export function useAppRoute() {
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

  const Page = useMemo(() => routes[currentPath] || fallbackRoute, [currentPath]);

  return { currentPath, Page };
}
