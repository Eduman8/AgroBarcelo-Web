import AdminLayout from '../../components/admin/AdminLayout.jsx';

function AdminSettingsPage({ currentPath = '/admin/configuracion' }) {
  return (
    <AdminLayout currentPath={currentPath}>
      <section className="admin-page-heading admin-placeholder">
        <p className="eyebrow">Configuración</p>
        <h1>Configuración del panel</h1>
        <p>Esta sección será implementada próximamente para administrar opciones generales del sitio.</p>
      </section>
    </AdminLayout>
  );
}

export default AdminSettingsPage;
