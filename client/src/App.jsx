import Footer from './components/layout/Footer.jsx';
import Header from './components/layout/Header.jsx';
import { useAppRoute } from './hooks/useAppRoute.js';

function App() {
  const { currentPath, Page } = useAppRoute();

  return (
    <>
      <Header currentPath={currentPath} />
      <main className="page">
        <Page />
      </main>
      <Footer currentPath={currentPath} />
    </>
  );
}

export default App;
