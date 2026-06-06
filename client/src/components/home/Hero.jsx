import Button from '../ui/Button.jsx';

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__content">
        <p className="eyebrow">AGROVENTAS BARCELÓ</p>
        <h1>Soluciones integrales para el agro</h1>
        <p className="hero__text">
          Repuestos agrícolas, maquinarias nuevas y usadas, postventa y mecanizado CNC para acompañar el trabajo de cada día.
        </p>
        <div className="hero__actions">
          <Button href="/contacto">Consultar ahora</Button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
