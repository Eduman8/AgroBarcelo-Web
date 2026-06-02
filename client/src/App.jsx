import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${apiUrl}/api/products`);

        if (!response.ok) {
          throw new Error('No se pudieron cargar los productos.');
        }

        const data = await response.json();
        setProducts(data);
      } catch (currentError) {
        setError(currentError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">AgroBarceló</p>
        <h1>Soluciones para el campo</h1>
        <p className="hero-text">
          Repuestos, maquinarias y artículos rurales para acompañar el trabajo agropecuario.
        </p>
      </section>

      <section className="products-section" aria-labelledby="products-title">
        <div className="section-heading">
          <p className="eyebrow">Catálogo inicial</p>
          <h2 id="products-title">Productos destacados</h2>
        </div>

        {isLoading && <p className="status-message">Cargando productos...</p>}
        {error && <p className="status-message error">{error}</p>}

        {!isLoading && !error && (
          <div className="products-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <span className="category">{product.category}</span>
                <h3>{product.name}</h3>
                <dl>
                  <div>
                    <dt>Stock</dt>
                    <dd>Disponible</dd>
                  </div>
                  <div>
                    <dt>Precio</dt>
                    <dd>Consultar precio</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
