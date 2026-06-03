import { useEffect, useMemo, useState } from 'react';
import { getSpareParts } from '../services/sparePartsService.js';

const emptyValue = 'Sin informar';

function normalizeSearchValue(value) {
  return String(value ?? '').trim().toLocaleLowerCase('es-AR');
}

function getDisplayValue(value) {
  if (value === null || value === undefined || value === '') {
    return emptyValue;
  }

  return value;
}

function getSparePartKey(sparePart) {
  return sparePart.id ?? `${sparePart.codigo}-${sparePart.nombre}`;
}

function SparePartsPage() {
  const [spareParts, setSpareParts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadSpareParts() {
      try {
        const data = await getSpareParts();

        if (isMounted) {
          setSpareParts(Array.isArray(data) ? data : []);
        }
      } catch (currentError) {
        if (isMounted) {
          setError(currentError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSpareParts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSpareParts = useMemo(() => {
    const normalizedSearchTerm = normalizeSearchValue(searchTerm);

    if (!normalizedSearchTerm) {
      return spareParts;
    }

    return spareParts.filter((sparePart) => {
      const searchableValues = [sparePart.nombre, sparePart.codigo, sparePart.marca];

      return searchableValues.some((value) =>
        normalizeSearchValue(value).includes(normalizedSearchTerm)
      );
    });
  }, [searchTerm, spareParts]);

  return (
    <section className="spare-parts-page" aria-labelledby="spare-parts-title">
      <div className="spare-parts-hero">
        <p className="eyebrow">Catálogo AgroBarceló</p>
        <h1 id="spare-parts-title">Repuestos</h1>
        <p>Encontrá repuestos para tu maquinaria de forma rápida y sencilla.</p>
      </div>

      <div className="spare-parts-search" role="search">
        <label className="spare-parts-search__label" htmlFor="spare-parts-search-input">
          Buscar repuestos
        </label>
        <input
          id="spare-parts-search-input"
          type="search"
          value={searchTerm}
          placeholder="Buscar por nombre, código o marca..."
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {isLoading && <p className="status-message">Cargando repuestos...</p>}
      {error && <p className="status-message status-message--error">{error}</p>}

      {!isLoading && !error && (
        <>
          <div className="spare-parts-table-wrapper">
            <table className="spare-parts-table">
              <thead>
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Marca</th>
                  <th scope="col">SubRubro</th>
                  <th scope="col">Disponibilidad</th>
                </tr>
              </thead>
              <tbody>
                {filteredSpareParts.map((sparePart) => (
                  <tr key={getSparePartKey(sparePart)}>
                    <td data-label="Código">{getDisplayValue(sparePart.codigo)}</td>
                    <td data-label="Nombre">{getDisplayValue(sparePart.nombre)}</td>
                    <td data-label="Marca">{getDisplayValue(sparePart.marca)}</td>
                    <td data-label="SubRubro">{getDisplayValue(sparePart.subRubro)}</td>
                    <td data-label="Disponibilidad">
                      <span className="availability">
                        {getDisplayValue(sparePart.disponibilidad)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSpareParts.length === 0 ? (
            <p className="status-message spare-parts-empty">
              No se encontraron repuestos con ese nombre, código o marca.
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}

export default SparePartsPage;
