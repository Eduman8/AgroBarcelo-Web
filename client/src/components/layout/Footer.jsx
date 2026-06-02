import Logo from '../ui/Logo.jsx';

const footerLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Repuestos', href: '#repuestos' },
  { label: 'Maquinarias', href: '#maquinarias' },
  { label: 'Artículos rurales', href: '#articulos-rurales' },
  { label: 'Contacto', href: '#contacto' }
];

function Footer() {
  return (
    <footer className="site-footer" id="contacto">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Logo variant="footer" />
          <p>
            Acompañamos al productor con soluciones confiables y productos de calidad para el
            trabajo de cada día.
          </p>
        </div>

        <div className="site-footer__nav-column">
          <h2 className="site-footer__column-title">Navegación</h2>
          <nav className="footer-nav" aria-label="Navegación de pie de página">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="site-footer__contact-column">
          <h2 className="site-footer__column-title">Contacto</h2>
          <address className="footer-contact">
            <a href="https://wa.me/" target="_blank" rel="noreferrer">
              Consultar por WhatsApp
            </a>
            <a href="mailto:info@agrobarcelo.com.ar">info@agrobarcelo.com.ar</a>
            <span>Ubicación a definir</span>
          </address>
        </div>

        <div className="site-footer__bottom">
          <p>© 2025 AgroBarceló. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
