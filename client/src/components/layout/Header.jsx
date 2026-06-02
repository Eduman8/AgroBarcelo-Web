import Button from '../ui/Button.jsx';
import Logo from '../ui/Logo.jsx';

const navigationItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Repuestos', href: '#repuestos' },
  { label: 'Maquinarias', href: '/maquinarias' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Acerca de', href: '/acerca-de' },
  { label: 'Contacto', href: '#contacto' }
];

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

        <Button href="#contacto" variant="header">
          Consultanos
        </Button>
      </div>
    </header>
  );
}

export default Header;
