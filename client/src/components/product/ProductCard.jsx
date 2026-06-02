function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-card__image" aria-hidden="true">
        <span>{product.category.slice(0, 1)}</span>
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3>{product.name}</h3>
        <div className="product-card__meta">
          <span className="availability">Disponible</span>
          <strong>Consultar precio</strong>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
