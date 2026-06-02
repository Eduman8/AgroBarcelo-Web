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
          <span className="brand__mark">AB</span>
          <div>
            <strong>AgroBarceló</strong>
            <p>Soluciones sobrias y confiables para el trabajo agropecuario.</p>
          </div>
        </div>

        <nav className="footer-nav" aria-label="Navegación de pie de página">
          {footerLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <address className="footer-contact">
          <a href="https://wa.me/" target="_blank" rel="noreferrer">
            Consultar por WhatsApp
          </a>
          <a href="mailto:info@agrobarcelo.com.ar">info@agrobarcelo.com.ar</a>
          <span>Ubicación a definir</span>
        </address>
      </div>
    </footer>
  );
}

export default Footer;
