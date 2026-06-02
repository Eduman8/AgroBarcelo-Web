import Button from '../components/ui/Button.jsx';

const services = [
  {
    icon: '🚜',
    title: 'Venta de maquinaria',
    description:
      'Tractores, sembradoras, rastras e implementos agrícolas seleccionados para cada necesidad del campo.',
    action: 'Ver maquinarias',
    href: '#maquinarias'
  },
  {
    icon: '☏',
    title: 'Servicio postventa',
    description:
      'Asistencia técnica y acompañamiento especializado para mantener tu maquinaria trabajando.',
    action: 'Consultar por WhatsApp',
    href: 'https://wa.me/5490000000000',
    isExternal: true
  },
  {
    icon: '⚙',
    title: 'Servicio de mecanizado CNC',
    description: 'Fabricación y mecanizado de piezas especiales con precisión y tecnología.',
    action: 'Solicitar cotización',
    href: '#contacto'
  },
  {
    icon: '◎',
    title: 'Venta de repuestos',
    description: 'Repuestos agrícolas para maquinaria, con búsqueda y consulta personalizada.',
    action: 'Buscar repuestos',
    href: '#repuestos'
  }
];

function ServicesPage() {
  return (
    <section className="services-page" aria-labelledby="services-title">
      <div className="services-hero">
        <p className="eyebrow">Soluciones AgroBarceló</p>
        <h1 id="services-title">Nuestros servicios</h1>
        <p>
          Acompañamos al productor con maquinarias, repuestos y soporte especializado para el
          trabajo diario en el campo.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <article className="service-card" key={service.title}>
            <span className="service-card__icon" aria-hidden="true">
              {service.icon}
            </span>
            <div className="service-card__content">
              <h2>{service.title}</h2>
              <p>{service.description}</p>
            </div>
            <Button
              href={service.href}
              variant="primary"
              className="service-card__button"
              target={service.isExternal ? '_blank' : undefined}
              rel={service.isExternal ? 'noreferrer' : undefined}
            >
              {service.action}
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ServicesPage;
