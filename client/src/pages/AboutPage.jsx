const aboutSections = [
  {
    title: 'Nuestra historia',
    text:
      'AgroBarceló nace del trabajo cercano con productores y contratistas de la región, construyendo una trayectoria basada en la atención personalizada, el conocimiento técnico y un vínculo directo con las necesidades reales del agro.'
  },
  {
    title: 'Qué hacemos',
    text:
      'Brindamos soluciones integrales para el sector agropecuario: venta de maquinarias, repuestos agrícolas, servicio postventa y mecanizado CNC para piezas y desarrollos especiales.'
  },
  {
    title: 'Nuestro compromiso',
    text:
      'Trabajamos para ser un aliado confiable, con cercanía, asesoramiento responsable y respuesta rápida en cada consulta, reparación o búsqueda de soluciones para mantener el campo en marcha.'
  }
];

function AboutPage() {
  return (
    <section className="about-page" aria-labelledby="about-title">
      <div className="about-hero">
        <p className="eyebrow">Empresa local</p>
        <h1 id="about-title">Acerca de AgroBarceló</h1>
        <p>
          Una empresa de Armstrong, Santa Fe, dedicada a acompañar al sector agropecuario con
          soluciones confiables.
        </p>
      </div>

      <div className="about-content">
        {aboutSections.map((section) => (
          <article className="about-card" key={section.title}>
            <span className="about-card__marker" aria-hidden="true" />
            <div>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AboutPage;
