import { useEffect, useState } from 'react';
import { getSparePartById } from '../services/sparePartsService.js';

const emptyValue = 'Sin informar';

function getDisplayValue(value) {
  if (value === null || value === undefined || value === '') {
    return emptyValue;
  }

  return value;
}

function getSparePartId(routeParams) {
  return routeParams?.id ?? window.location.pathname.split('/').filter(Boolean).at(-1);
}

function SparePartDetailPage({ routeParams }) {
  const sparePartId = getSparePartId(routeParams);
  const [sparePart, setSparePart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [wasNotFound, setWasNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadSparePart() {
      setIsLoading(true);
      setError('');
      setWasNotFound(false);

      try {
        const response = await getSparePartById(sparePartId);

        if (!isMounted) {
          return;
        }

        if (!response) {
          setSparePart(null);
          setWasNotFound(true);
          return;
        }

        setSparePart(response);
      } catch (currentError) {
        if (isMounted) {
          setSparePart(null);
          setError(currentError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSparePart();

    return () => {
      isMounted = false;
    };
  }, [sparePartId]);

  return (
    <section className="spare-part-detail-page" aria-labelledby="spare-part-detail-title">
      <a className="spare-part-detail__back" href="/repuestos">
        ← Volver a repuestos
      </a>

      {isLoading && <p className="status-message">Cargando detalle del repuesto...</p>}
      {error && <p className="status-message status-message--error">{error}</p>}
      {wasNotFound && (
        <div className="spare-part-detail-card spare-part-detail-card--empty">
          <p className="eyebrow">Detalle de repuesto</p>
          <h1 id="spare-part-detail-title">Repuesto no encontrado</h1>
          <p>No encontramos un repuesto publicado con el identificador solicitado.</p>
        </div>
      )}

      {!isLoading && !error && sparePart && (
        <article className="spare-part-detail-card">
          <div className="spare-part-detail-card__header">
            <div>
              <p className="eyebrow">Ficha técnica</p>
              <h1 id="spare-part-detail-title">{getDisplayValue(sparePart.nombre)}</h1>
            </div>
            <span className="availability">{getDisplayValue(sparePart.disponibilidad)}</span>
          </div>

          <dl className="spare-part-detail-list">
            <div>
              <dt>Código</dt>
              <dd>{getDisplayValue(sparePart.codigo)}</dd>
            </div>
            <div>
              <dt>Marca</dt>
              <dd>{getDisplayValue(sparePart.marca)}</dd>
            </div>
            <div>
              <dt>Rubro</dt>
              <dd>{getDisplayValue(sparePart.rubro)}</dd>
            </div>
            <div>
              <dt>SubRubro</dt>
              <dd>{getDisplayValue(sparePart.subRubro)}</dd>
            </div>
            <div>
              <dt>Disponibilidad</dt>
              <dd>{getDisplayValue(sparePart.disponibilidad)}</dd>
            </div>
          </dl>

          <div className="spare-part-detail-actions">
            <a className="button button--primary" href={`/contacto?producto=${encodeURIComponent(sparePart.id)}`}>
              Consultar
            </a>
            <a className="spare-part-detail-actions__secondary" href="/repuestos">
              Volver a repuestos
            </a>
          </div>
        </article>
      )}
    </section>
  );
}

export default SparePartDetailPage;
