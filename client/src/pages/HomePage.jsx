import { useEffect, useState } from 'react';
import CategoriesSection from '../components/home/CategoriesSection.jsx';
import FeaturedProducts from '../components/home/FeaturedProducts.jsx';
import Hero from '../components/home/Hero.jsx';
import { getProducts } from '../services/productService.js';

function HomePage() {
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
      <Hero />
      <CategoriesSection />
      <FeaturedProducts products={products} isLoading={isLoading} error={error} />
    </>
  );
}

export default HomePage;
