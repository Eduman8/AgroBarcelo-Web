const categories = [
  {
    id: 'repuestos',
    icon: '⚙',
    title: 'Repuestos',
    description: 'Repuestos agrícolas para mantener tus equipos trabajando en el campo.',
    href: '/repuestos',
    action: 'Ver repuestos'
  },
  {
    id: 'maquinarias',
    icon: '🚜',
    title: 'Maquinarias',
    description: 'Maquinarias nuevas y usadas seleccionadas para cada necesidad productiva.',
    href: '/maquinarias',
    action: 'Ver maquinarias'
  },
  {
    id: 'servicios',
    icon: '⌂',
    title: 'Servicios',
    description: 'Postventa, mantenimiento y mecanizado CNC para acompañar tu operación.',
    href: '/servicios',
    action: 'Conocer servicios'
  },
  {
    id: 'contacto',
    icon: '☏',
    title: 'Contacto',
    description: 'Recibí asesoramiento personalizado para encontrar la solución indicada.',
    href: '/contacto',
    action: 'Consultar ahora'
  }
];

function CategoriesSection() {
  return (
    <section className="section categories-section" aria-labelledby="categories-title">
      <div className="section-heading">
        <p className="eyebrow">Accesos principales</p>
        <h2 id="categories-title">Encontrá rápido lo que necesitás</h2>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <a className="category-card" href={category.href} id={category.id} key={category.id}>
            <span className="category-card__icon" aria-hidden="true">
              {category.icon}
            </span>
            <div className="category-card__body">
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <span className="category-card__action">{category.action}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default CategoriesSection;
