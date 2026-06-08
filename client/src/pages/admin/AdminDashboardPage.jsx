import AdminLayout from '../../components/admin/AdminLayout.jsx';

const summaryCards = [
  { label: 'Maquinarias publicadas', value: '12', detail: 'Datos mock para la primera fase' },
  { label: 'Usuarios pendientes', value: '3', detail: 'Solicitudes por revisar' },
  { label: 'Consultas recibidas', value: '18', detail: 'Mensajes simulados' },
  { label: 'Estado del sitio', value: 'Activo', detail: 'Operación normal' }
];

function AdminDashboardPage({ currentPath = '/admin' }) {
  return (
    <AdminLayout currentPath={currentPath}>
      <section className="admin-page-heading">
        <p className="eyebrow">Dashboard</p>
        <h1>Panel administrativo</h1>
        <p>
          Vista inicial para centralizar la gestión de AgroBarceló. La información se muestra con datos mock hasta conectar las fuentes definitivas.
        </p>
      </section>

      <section className="admin-summary-grid" aria-label="Resumen del panel administrativo">
        {summaryCards.map((card) => (
          <article className="admin-summary-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <p>{card.detail}</p>
          </article>
        ))}
      </section>
    </AdminLayout>
  );
}

export default AdminDashboardPage;
