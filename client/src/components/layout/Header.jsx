import { navigationItems } from '../../config/navigation.js';
import Logo from '../ui/Logo.jsx';

function Header({ currentPath = '/' }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="/" aria-label="AgroBarceló - Inicio">
          <Logo variant="header" />
        </a>

        <nav className="main-nav" aria-label="Navegación principal">
          {navigationItems.map((item) => (
            <a
              className={item.href === currentPath ? 'is-active' : undefined}
              key={item.label}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
