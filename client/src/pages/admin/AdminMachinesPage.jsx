import AdminLayout from '../../components/admin/AdminLayout.jsx';

function AdminMachinesPage({ currentPath = '/admin/maquinarias' }) {
  return (
    <AdminLayout currentPath={currentPath}>
      <section className="admin-page-heading admin-placeholder">
        <p className="eyebrow">Maquinarias</p>
        <h1>Gestión de maquinarias</h1>
        <p>Esta sección será implementada próximamente para administrar las maquinarias publicadas.</p>
      </section>
    </AdminLayout>
  );
}

export default AdminMachinesPage;
