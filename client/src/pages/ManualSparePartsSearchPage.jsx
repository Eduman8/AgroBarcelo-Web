import { useEffect, useMemo, useState } from 'react';
import { searchManualSpareParts } from '../services/manualSparePartsSearchService.js';

const searchLimit = 25;

const getDisplayValue = (value, fallback = 'Sin informar') => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  return value;
};

function ManualSparePartsSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const hasSearch = submittedSearch.trim().length > 0;
  const emptyMessage = useMemo(() => {
    if (!hasSearch) {
      return 'Ingresá un código, descripción, manual, marca o modelo para consultar los repuestos importados.';
    }

    return 'No se encontraron repuestos manuales para la búsqueda indicada.';
  }, [hasSearch]);

  useEffect(() => {
    if (!hasSearch) {
      setResults([]);
      return undefined;
    }

    let isMounted = true;

    async function loadSearchResults() {
      setIsLoading(true);
      setError('');

      try {
        const response = await searchManualSpareParts({
          search: submittedSearch,
          limit: searchLimit
        });

        if (isMounted) {
          setResults(Array.isArray(response.data) ? response.data : []);
        }
      } catch (currentError) {
        if (isMounted) {
          setResults([]);
          setError(currentError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSearchResults();

    return () => {
      isMounted = false;
    };
  }, [hasSearch, submittedSearch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedSearch(searchTerm.trim());
  };

  return (
    <section className="manual-spare-parts-page" aria-labelledby="manual-spare-parts-title">
      <div className="manual-spare-parts-hero">
        <p className="eyebrow">Arquitectura de búsqueda</p>
        <h1 id="manual-spare-parts-title">Buscador de Repuestos</h1>
        <p>
          Módulo preparado para consultar repuestos identificados desde manuales, páginas y
          referencias técnicas cuando se importen los datos.
        </p>
      </div>

      <div className="manual-spare-parts-layout">
        <section className="manual-spare-parts-panel" aria-labelledby="manual-spare-parts-search-title">
          <div className="manual-spare-parts-panel__header">
            <p className="eyebrow">Búsqueda</p>
            <h2 id="manual-spare-parts-search-title">Consultar repuestos manuales</h2>
            <p>
              La interfaz ya consume el servicio de búsqueda. La siguiente etapa será importar datos
              a la tabla SQL para poblar estos resultados.
            </p>
          </div>

          <form className="manual-spare-parts-search" onSubmit={handleSubmit} role="search">
            <label htmlFor="manual-spare-parts-search-input">Código, descripción, manual o modelo</label>
            <div className="manual-spare-parts-search__controls">
              <input
                id="manual-spare-parts-search-input"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Ej.: cuchilla, 6205, rastra, grano fino"
              />
              <button type="submit">Buscar</button>
            </div>
          </form>
        </section>

        <aside className="manual-spare-parts-roadmap" aria-labelledby="manual-spare-parts-roadmap-title">
          <p className="eyebrow">Preparado para ampliar</p>
          <h2 id="manual-spare-parts-roadmap-title">Próximas etapas</h2>
          <ul>
            <li>Importación de datos extraídos desde manuales.</li>
            <li>Normalización de códigos, páginas y referencias de despiece.</li>
            <li>Conexión futura con PDFs, OCR o despieces interactivos.</li>
          </ul>
        </aside>
      </div>

      <section className="manual-spare-parts-results" aria-labelledby="manual-spare-parts-results-title">
        <div className="manual-spare-parts-results__header">
          <div>
            <p className="eyebrow">Resultados</p>
            <h2 id="manual-spare-parts-results-title">Coincidencias de manuales</h2>
          </div>
          {hasSearch && !isLoading && !error && (
            <span>{results.length} resultados para “{submittedSearch}”</span>
          )}
        </div>

        {isLoading && <p className="status-message">Buscando repuestos manuales...</p>}
        {error && <p className="status-message status-message--error">{error}</p>}

        {!isLoading && !error && results.length > 0 && (
          <div className="manual-spare-parts-table-wrapper">
            <table className="manual-spare-parts-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Manual</th>
                  <th>Página</th>
                  <th>Modelo</th>
                  <th>Referencia</th>
                </tr>
              </thead>
              <tbody>
                {results.map((sparePart) => (
                  <tr key={sparePart.id}>
                    <td data-label="Código">{getDisplayValue(sparePart.codigo, 'Sin código')}</td>
                    <td data-label="Descripción">{getDisplayValue(sparePart.descripcion)}</td>
                    <td data-label="Manual">{getDisplayValue(sparePart.manualNombre)}</td>
                    <td data-label="Página">{getDisplayValue(sparePart.pagina)}</td>
                    <td data-label="Modelo">{getDisplayValue(sparePart.modeloMaquina)}</td>
                    <td data-label="Referencia">{getDisplayValue(sparePart.referenciaDespiece)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !error && results.length === 0 && (
          <p className="status-message manual-spare-parts-empty">{emptyMessage}</p>
        )}
      </section>
    </section>
  );
}

export default ManualSparePartsSearchPage;
