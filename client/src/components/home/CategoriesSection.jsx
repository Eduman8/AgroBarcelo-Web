const categories = [
  {
    id: 'repuestos',
    icon: '⚙️',
    title: 'Repuestos',
    description: 'Piezas, filtros y componentes para mantener tus equipos siempre activos.'
  },
  {
    id: 'maquinarias',
    icon: '🚜',
    title: 'Maquinarias',
    description: 'Equipamiento agrícola seleccionado para tareas exigentes del campo.'
  },
  {
    id: 'articulos-rurales',
    icon: '🌾',
    title: 'Artículos rurales',
    description: 'Insumos y soluciones prácticas para establecimientos agropecuarios.'
  }
];

function CategoriesSection() {
  return (
    <section className="section categories-section" aria-labelledby="categories-title">
      <div className="section-heading">
        <p className="eyebrow">Rubros principales</p>
        <h2 id="categories-title">Todo para el trabajo rural</h2>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <article className="category-card" id={category.id} key={category.id}>
            <span className="category-card__icon" aria-hidden="true">
              {category.icon}
            </span>
            <h3>{category.title}</h3>
            <p>{category.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CategoriesSection;
