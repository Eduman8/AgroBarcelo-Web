import { useEffect, useMemo, useState } from 'react';
import Button from '../components/ui/Button.jsx';
import { getMachines } from '../services/machinesService.js';
import {
  getMachineAvailabilityLabel,
  getMachineCategory,
  getMachineSlug,
  getMachineStatus,
  isSoldMachine,
  machineCategories,
  machineStatuses
} from '../utils/machines.js';

const allCategoriesLabel = 'Todas';
const allStatusesLabel = 'Todos';

const categoryFilterLabels = {
  Nueva: 'Nuevas',
  Usada: 'Usadas',
  'Trabajo Realizado': 'Trabajos Realizados'
};

const statusFilterLabels = {
  Disponible: 'Disponibles',
  Vendida: 'Vendidas'
};


function MachinesPage() {
  const [machines, setMachines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(allCategoriesLabel);
  const [selectedStatus, setSelectedStatus] = useState(allStatusesLabel);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadMachines() {
      setIsLoading(true);
      setError('');

      try {
        const response = await getMachines();

        if (!isMounted) {
          return;
        }

        setMachines(Array.isArray(response) ? response : []);

        if (response?.isFallback) {
          setError('No se pudo conectar con la API real. Se muestran maquinarias mock temporalmente.');
        }
      } catch (currentError) {
        if (isMounted) {
          setMachines([]);
          setError(currentError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMachines();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMachines = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase('es-AR');

    return machines.filter((machine) => {
      const machineCategory = getMachineCategory(machine);
      const machineStatus = getMachineStatus(machine);
      const matchesCategory = selectedCategory === allCategoriesLabel || machineCategory === selectedCategory;
      const matchesStatus = selectedStatus === allStatusesLabel || machineStatus === selectedStatus;
      const matchesSearch = machine.nombre.toLocaleLowerCase('es-AR').includes(normalizedSearchTerm);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [machines, searchTerm, selectedCategory, selectedStatus]);

  return (
    <section className="machines-page" aria-labelledby="machines-title">
      <div className="machines-hero">
        <p className="eyebrow">Catálogo AgroBarceló</p>
        <h1 id="machines-title">Maquinarias</h1>
        <p>
          Explorá maquinaria nueva, usada y trabajos realizados por AgroBarceló, con una
          estructura lista para sumar fotos y publicaciones reales.
        </p>
      </div>

      <div className="machines-toolbar">
        <div className="machines-search" role="search">
          <label className="machines-search__label" htmlFor="machines-search-input">
            Buscar por nombre
          </label>
          <input
            id="machines-search-input"
            type="search"
            value={searchTerm}
            placeholder="Ej: tractor, sembradora, rastra..."
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="machines-filter-group">
          <p>Categoría</p>
          <div className="machines-filter" aria-label="Filtrar por categoría">
            {[allCategoriesLabel, ...machineCategories].map((category) => {
              const isActive = selectedCategory === category;

              return (
                <button
                  className={`machines-filter__item${isActive ? ' is-active' : ''}`}
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedCategory(category)}
                >
                  {categoryFilterLabels[category] ?? category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="machines-filter-group">
          <p>Estado</p>
          <div className="machines-filter" aria-label="Filtrar por estado">
            {[allStatusesLabel, ...machineStatuses].map((status) => {
              const isActive = selectedStatus === status;

              return (
                <button
                  className={`machines-filter__item${isActive ? ' is-active' : ''}`}
                  key={status}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedStatus(status)}
                >
                  {statusFilterLabels[status] ?? status}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {isLoading && <p className="status-message">Cargando maquinarias...</p>}
      {error && <p className="status-message status-message--error">{error}</p>}

      {!isLoading && (
        <>
          <p className="machines-results-count">
            Mostrando {filteredMachines.length} de {machines.length} publicaciones
          </p>

          <div className="machines-grid">
            {filteredMachines.map((machine) => (
              <article className="machine-card" key={machine.id}>
                {machine.imagenPrincipal ? (
                  <img
                    className="machine-card__image"
                    src={machine.imagenPrincipal}
                    alt={`Imagen principal de ${machine.nombre}`}
                  />
                ) : (
                  <div className="machine-card__placeholder" aria-hidden="true">
                    <span>Imagen próximamente</span>
                  </div>
                )}

                <div className="machine-card__topline">
                  <span className="machine-card__type">{getMachineCategory(machine)}</span>
                  <span className={`machine-card__status${isSoldMachine(machine) ? ' machine-card__status--sold' : ''}`}>
                    {getMachineStatus(machine)}
                  </span>
                </div>

                <div className="machine-card__content">
                  <h2>{machine.nombre}</h2>
                  <p>{machine.descripcionCorta}</p>
                </div>

                <div className="machine-card__details">
                  <span className={`availability${isSoldMachine(machine) ? ' availability--sold' : ''}`}>
                    {getMachineAvailabilityLabel(machine)}
                  </span>
                </div>

                {isSoldMachine(machine) ? (
                  <span className="machine-card__button machine-card__button--disabled">No disponible</span>
                ) : (
                  <Button
                    href={`/maquinarias/${encodeURIComponent(getMachineSlug(machine))}`}
                    variant="primary"
                    className="machine-card__button"
                  >
                    Ver detalle
                  </Button>
                )}
              </article>
            ))}
          </div>

          {filteredMachines.length === 0 ? (
            <p className="status-message machines-empty">
              No se encontraron maquinarias con ese nombre o categoría.
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}

export default MachinesPage;
