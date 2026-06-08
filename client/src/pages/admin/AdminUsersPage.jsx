import AdminLayout from '../../components/admin/AdminLayout.jsx';

function AdminUsersPage({ currentPath = '/admin/usuarios' }) {
  return (
    <AdminLayout currentPath={currentPath}>
      <section className="admin-page-heading admin-placeholder">
        <p className="eyebrow">Usuarios</p>
        <h1>Gestión de usuarios</h1>
        <p>Esta sección será implementada próximamente para revisar y administrar usuarios del panel.</p>
      </section>
    </AdminLayout>
  );
}

export default AdminUsersPage;
