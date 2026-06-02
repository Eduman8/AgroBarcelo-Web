const categories = [
  {
    id: 'repuestos',
    icon: '⚙',
    title: 'Repuestos',
    description: 'Encontrá repuestos de calidad para tu maquinaria.'
  },
  {
    id: 'maquinarias',
    icon: '🚜',
    title: 'Maquinarias',
    description: 'Maquinarias robustas para cada necesidad del campo.'
  },
  {
    id: 'servicios',
    icon: '⌂',
    title: 'Servicios',
    description: 'Postventa, mecanizado CNC y soluciones para acompañar tu maquinaria.'
  }
];

function CategoriesSection() {
  return (
    <section className="section categories-section" aria-labelledby="categories-title">
      <div className="section-heading">
        <p className="eyebrow">Rubros principales</p>
        <h2 id="categories-title">Explorá nuestras categorías</h2>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <article className="category-card" id={category.id} key={category.id}>
            <span className="category-card__icon" aria-hidden="true">
              {category.icon}
            </span>
            <div className="category-card__body">
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CategoriesSection;
