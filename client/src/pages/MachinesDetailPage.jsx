import Button from '../components/ui/Button.jsx';
import { getMachineById } from '../data/machinesMock.js';

function getMachineId(routeParams) {
  return routeParams?.id ?? window.location.pathname.split('/').filter(Boolean).at(-1);
}

function getAvailabilityLabel(isAvailable) {
  return isAvailable ? 'Disponible' : 'Trabajo realizado';
}

function MachinesDetailPage({ routeParams }) {
  const machineId = getMachineId(routeParams);
  const machine = getMachineById(machineId);

  return (
    <section className="machine-detail-page" aria-labelledby="machine-detail-title">
      <a className="machine-detail__back" href="/maquinarias">
        ← Volver a maquinarias
      </a>

      {!machine ? (
        <div className="machine-detail-card machine-detail-card--empty">
          <p className="eyebrow">Detalle de maquinaria</p>
          <h1 id="machine-detail-title">Maquinaria no encontrada</h1>
          <p>No encontramos una publicación de maquinarias con el identificador solicitado.</p>
          <a className="machine-detail-actions__secondary" href="/maquinarias">
            Volver a maquinarias
          </a>
        </div>
      ) : (
        <article className="machine-detail-card">
          <div className="machine-detail-card__media" aria-hidden="true">
            <span>Foto próximamente</span>
          </div>

          <div className="machine-detail-card__body">
            <div className="machine-detail-card__header">
              <div>
                <p className="eyebrow">Ficha de maquinaria</p>
                <h1 id="machine-detail-title">{machine.nombre}</h1>
              </div>
              <span className="availability">{getAvailabilityLabel(machine.disponible)}</span>
            </div>

            <dl className="machine-detail-list">
              <div>
                <dt>Categoría</dt>
                <dd>{machine.categoria}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{machine.estado}</dd>
              </div>
              <div>
                <dt>Tipo</dt>
                <dd>{machine.tipo}</dd>
              </div>
            </dl>

            <div className="machine-detail-description">
              <h2>Descripción</h2>
              <p>{machine.descripcionCompleta ?? machine.descripcionCorta}</p>
            </div>

            <div className="machine-detail-actions">
              <Button href={`/contacto?maquinaria=${encodeURIComponent(machine.id)}`} variant="primary">
                Consultar
              </Button>
              <a className="machine-detail-actions__secondary" href="/maquinarias">
                Volver
              </a>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}

export default MachinesDetailPage;
