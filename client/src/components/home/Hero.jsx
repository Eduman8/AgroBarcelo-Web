import Button from '../ui/Button.jsx';

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__content">
        <p className="eyebrow">AGROVENTAS BARCELÓ</p>
        <h1>Soluciones para el agro</h1>
        <p className="hero__text">
          Repuestos, maquinarias y artículos rurales para acompañar el trabajo de cada día.
        </p>
        <div className="hero__actions">
          <Button href="#catalogo">Ver catálogo</Button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
