import HomePage from '../pages/HomePage.jsx';
import AboutPage from '../pages/AboutPage.jsx';
import ContactPage from '../pages/ContactPage.jsx';
import MachinesPage from '../pages/MachinesPage.jsx';
import ManualSparePartsSearchPage from '../pages/ManualSparePartsSearchPage.jsx';
import VisualSparePartsSearchPage from '../pages/VisualSparePartsSearchPage.jsx';
import MachinesDetailPage from '../pages/MachinesDetailPage.jsx';
import ServicesPage from '../pages/ServicesPage.jsx';
import SparePartDetailPage from '../pages/SparePartDetailPage.jsx';
import SparePartsPage from '../pages/SparePartsPage.jsx';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx';
import AdminInquiriesPage from '../pages/admin/AdminInquiriesPage.jsx';
import AdminMachinesPage from '../pages/admin/AdminMachinesPage.jsx';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage.jsx';
import AdminUsersPage from '../pages/admin/AdminUsersPage.jsx';

export const routes = {
  '/': HomePage,
  '/admin': AdminDashboardPage,
  '/admin/maquinarias': AdminMachinesPage,
  '/admin/usuarios': AdminUsersPage,
  '/admin/consultas': AdminInquiriesPage,
  '/admin/configuracion': AdminSettingsPage,
  '/repuestos': SparePartsPage,
  '/buscador-repuestos': ManualSparePartsSearchPage,
  '/buscador-visual-repuestos': VisualSparePartsSearchPage,
  '/repuestos/:id': SparePartDetailPage,
  '/maquinarias': MachinesPage,
  '/maquinarias/:slug': MachinesDetailPage,
  '/servicios': ServicesPage,
  '/acerca-de': AboutPage,
  '/contacto': ContactPage
};

export const fallbackRoute = HomePage;
