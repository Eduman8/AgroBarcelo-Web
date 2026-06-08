import AdminLayout from '../../components/admin/AdminLayout.jsx';

function AdminInquiriesPage({ currentPath = '/admin/consultas' }) {
  return (
    <AdminLayout currentPath={currentPath}>
      <section className="admin-page-heading admin-placeholder">
        <p className="eyebrow">Consultas</p>
        <h1>Consultas recibidas</h1>
        <p>Esta sección será implementada próximamente para visualizar y gestionar consultas comerciales.</p>
      </section>
    </AdminLayout>
  );
}

export default AdminInquiriesPage;
