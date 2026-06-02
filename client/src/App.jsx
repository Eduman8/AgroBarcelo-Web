import { useEffect, useState } from 'react';
import CategoriesSection from './components/home/CategoriesSection.jsx';
import FeaturedProducts from './components/home/FeaturedProducts.jsx';
import Hero from './components/home/Hero.jsx';
import Footer from './components/layout/Footer.jsx';
import Header from './components/layout/Header.jsx';
import { getProducts } from './services/productService.js';

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
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
    <>
      <Header />
      <main className="page">
        <Hero />
        <CategoriesSection />
        <FeaturedProducts products={products} isLoading={isLoading} error={error} />
      </main>
      <Footer />
    </>
  );
}

export default App;
