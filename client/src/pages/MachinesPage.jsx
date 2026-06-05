import { useMemo, useState } from 'react';
import Button from '../components/ui/Button.jsx';
import { machineCategories, machinesMock } from '../data/machinesMock.js';

const allCategoriesLabel = 'Todas';

function getAvailabilityLabel(isAvailable) {
  return isAvailable ? 'Disponible' : 'Trabajo realizado';
}

function MachinesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(allCategoriesLabel);

  const filteredMachines = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase('es-AR');

    return machinesMock.filter((machine) => {
      const matchesCategory =
        selectedCategory === allCategoriesLabel || machine.categoria === selectedCategory;
      const matchesSearch = machine.nombre.toLocaleLowerCase('es-AR').includes(normalizedSearchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

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
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <p className="machines-results-count">
        Mostrando {filteredMachines.length} de {machinesMock.length} publicaciones
      </p>

      <div className="machines-grid">
        {filteredMachines.map((machine) => (
          <article className="machine-card" key={machine.id}>
            <div className="machine-card__placeholder" aria-hidden="true">
              <span>{machine.tipo}</span>
            </div>

            <div className="machine-card__topline">
              <span className="machine-card__type">{machine.categoria}</span>
              <span className="machine-card__status">{machine.estado}</span>
            </div>

            <div className="machine-card__content">
              <h2>{machine.nombre}</h2>
              <p>{machine.descripcionCorta}</p>
            </div>

            <div className="machine-card__details">
              <span className="availability">{getAvailabilityLabel(machine.disponible)}</span>
            </div>

            <Button
              href={`/maquinarias/${encodeURIComponent(machine.id)}`}
              variant="primary"
              className="machine-card__button"
            >
              Ver detalle
            </Button>
          </article>
        ))}
      </div>

      {filteredMachines.length === 0 ? (
        <p className="status-message machines-empty">
          No se encontraron maquinarias con ese nombre o categoría.
        </p>
      ) : null}
    </section>
  );
}

export default MachinesPage;
