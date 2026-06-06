import Logo from '../ui/Logo.jsx';

function Footer() {
  return (
    <footer className="site-footer" id="contacto">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Logo variant="footer" />
          <p>
            Acompañamos al productor con soluciones confiables, repuestos agrícolas,
            maquinarias, postventa y mecanizado CNC para el trabajo de cada día.
          </p>
        </div>

        <div className="site-footer__contact-column">
          <h2 className="site-footer__column-title">Contacto</h2>
          <address className="footer-contact">
            <a className="footer-contact__link footer-contact__link--whatsapp" href="https://wa.me/5490000000000" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a className="footer-contact__link footer-contact__link--email" href="mailto:info@agrobarcelo.com.ar">
              info@agrobarcelo.com.ar
            </a>
            <a className="footer-contact__link footer-contact__link--instagram" href="https://www.instagram.com/agrobarcelo/" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <span className="footer-contact__location">Ubicación a definir</span>
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
