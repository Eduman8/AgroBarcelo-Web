import ProductCard from '../product/ProductCard.jsx';

function FeaturedProducts({ products, isLoading, error }) {
  return (
    <section className="section products-section" id="catalogo" aria-labelledby="products-title">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">Catálogo destacado</p>
          <h2 id="products-title">Catálogo destacado</h2>
        </div>
        <a className="featured-heading-button" href="#catalogo">
          Ver todos los productos
        </a>
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
