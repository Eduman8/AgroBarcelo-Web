import Button from '../ui/Button.jsx';

const navigationItems = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Repuestos', href: '#repuestos' },
  { label: 'Maquinarias', href: '#maquinarias' },
  { label: 'Artículos rurales', href: '#articulos-rurales' },
  { label: 'Contacto', href: '#contacto' }
];

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#inicio" aria-label="AgroBarceló - Inicio">
          <span className="brand__mark">AB</span>
          <span className="brand__text">
            <strong>AgroBarceló</strong>
            <small>AgroVentas Barceló</small>
          </span>
        </a>

        <nav className="main-nav" aria-label="Navegación principal">
          {navigationItems.map((item) => (
            <a key={item.href} href={item.href}>
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
