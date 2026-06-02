import ProductCard from '../product/ProductCard.jsx';

function FeaturedProducts({ products, isLoading, error }) {
  return (
    <section className="section products-section" id="catalogo" aria-labelledby="products-title">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">Catálogo destacado</p>
          <h2 id="products-title">Productos para consultar</h2>
        </div>
        <p>
          Una selección inicial de repuestos, maquinarias y artículos rurales disponibles para
          cotizar.
        </p>
      </div>

      {isLoading && <p className="status-message">Cargando productos...</p>}
      {error && <p className="status-message status-message--error">{error}</p>}

      {!isLoading && !error && (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedProducts;
