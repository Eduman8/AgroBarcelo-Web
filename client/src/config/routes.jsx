import HomePage from '../pages/HomePage.jsx';
import AboutPage from '../pages/AboutPage.jsx';
import ContactPage from '../pages/ContactPage.jsx';
import MachinesPage from '../pages/MachinesPage.jsx';
import ServicesPage from '../pages/ServicesPage.jsx';
import SparePartDetailPage from '../pages/SparePartDetailPage.jsx';
import SparePartsPage from '../pages/SparePartsPage.jsx';

export const routes = {
  '/': HomePage,
  '/repuestos': SparePartsPage,
  '/repuestos/:id': SparePartDetailPage,
  '/maquinarias': MachinesPage,
  '/servicios': ServicesPage,
  '/acerca-de': AboutPage,
  '/contacto': ContactPage
};

export const fallbackRoute = HomePage;
