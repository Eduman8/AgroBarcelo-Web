import Button from '../components/ui/Button.jsx';
import { getMachineById } from '../data/machinesMock.js';

function getMachineId(routeParams) {
  return routeParams?.id ?? window.location.pathname.split('/').filter(Boolean).at(-1);
}

function getAvailabilityLabel(isAvailable) {
  return isAvailable ? 'Disponible' : 'No disponible';
}

function MachinesDetailPage({ routeParams }) {
  const machineId = getMachineId(routeParams);
  const machine = getMachineById(machineId);
  const galleryImages = machine?.galeria ?? [];
  const hasGalleryImages = galleryImages.length > 0;

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
          <div className="machine-detail-gallery" aria-labelledby="machine-gallery-title">
            <div className="machine-detail-card__media">
              {machine.imagenPrincipal ? (
                <img src={machine.imagenPrincipal} alt={`Imagen principal de ${machine.nombre}`} />
              ) : (
                <div className="machine-detail-media__placeholder" aria-hidden="true">
                  <span>Imagen principal próximamente</span>
                </div>
              )}
            </div>

            <div className="machine-detail-gallery__header">
              <h2 id="machine-gallery-title">Galería de imágenes</h2>
              <p>Espacio preparado para fotos reales y miniaturas de la publicación.</p>
            </div>

            {hasGalleryImages ? (
              <div className="machine-detail-thumbnails" aria-label="Miniaturas de la maquinaria">
                {galleryImages.map((imageSrc, index) => (
                  <button className="machine-detail-thumbnail" key={`${imageSrc}-${index}`} type="button">
                    <img src={imageSrc} alt={`${machine.nombre} - imagen ${index + 1}`} />
                  </button>
                ))}
              </div>
            ) : (
              <div className="machine-detail-gallery__empty" aria-live="polite">
                <span>Galería próximamente</span>
                <p>Esta publicación todavía no tiene imágenes cargadas.</p>
              </div>
            )}
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
                <dt>Disponibilidad</dt>
                <dd>{getAvailabilityLabel(machine.disponible)}</dd>
              </div>
            </dl>

            <div className="machine-detail-description">
              <h2>Descripción larga</h2>
              <p>{machine.descripcionLarga}</p>
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
