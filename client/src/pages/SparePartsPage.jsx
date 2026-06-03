import { useEffect, useState } from 'react';
import { getSpareParts } from '../services/sparePartsService.js';

const emptyValue = 'Sin informar';
const sparePartsLimit = 50;

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
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: sparePartsLimit,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadSpareParts() {
      setIsLoading(true);
      setError('');

      try {
        const response = await getSpareParts({
          page,
          limit: sparePartsLimit,
          search: searchTerm
        });

        if (isMounted) {
          setSpareParts(Array.isArray(response.data) ? response.data : []);
          setPagination({
            total: response.pagination?.total ?? 0,
            page: response.pagination?.page ?? page,
            limit: response.pagination?.limit ?? sparePartsLimit,
            totalPages: response.pagination?.totalPages ?? 0
          });
        }
      } catch (currentError) {
        if (isMounted) {
          setSpareParts([]);
          setPagination({
            total: 0,
            page,
            limit: sparePartsLimit,
            totalPages: 0
          });
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
  }, [page, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const goToPreviousPage = () => {
    setPage((currentPage) => Math.max(currentPage - 1, 1));
  };

  const goToNextPage = () => {
    setPage((currentPage) => Math.min(currentPage + 1, pagination.totalPages || currentPage));
  };

  const currentPage = pagination.page || page;
  const totalPages = pagination.totalPages || 1;
  const isPreviousDisabled = isLoading || currentPage === 1;
  const isNextDisabled = isLoading || currentPage >= totalPages;

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
          onChange={handleSearchChange}
        />
      </div>

      {isLoading && <p className="status-message">Cargando repuestos...</p>}
      {error && <p className="status-message status-message--error">{error}</p>}

      {!isLoading && !error && (
        <>
          <p className="spare-parts-results-count">
            Mostrando {spareParts.length} de {pagination.total} repuestos
          </p>

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
                {spareParts.map((sparePart) => (
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

          {spareParts.length === 0 ? (
            <p className="status-message spare-parts-empty">
              No se encontraron repuestos con ese nombre, código o marca.
            </p>
          ) : null}

          <div className="spare-parts-pagination" aria-label="Paginación de repuestos">
            <button type="button" onClick={goToPreviousPage} disabled={isPreviousDisabled}>
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button type="button" onClick={goToNextPage} disabled={isNextDisabled}>
              Siguiente
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default SparePartsPage;
