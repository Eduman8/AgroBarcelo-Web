import { useEffect, useMemo, useState } from 'react';
import Button from '../components/ui/Button.jsx';
import { getSpareParts } from '../services/sparePartsService.js';

function normalizeSearchValue(value) {
  return value.trim().toLocaleLowerCase('es-AR');
}

function SparePartsPage() {
  const [spareParts, setSpareParts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadSpareParts() {
      const data = await getSpareParts();
      setSpareParts(data);
    }

    loadSpareParts();
  }, []);

  const filteredSpareParts = useMemo(() => {
    const normalizedSearchTerm = normalizeSearchValue(searchTerm);

    if (!normalizedSearchTerm) {
      return spareParts;
    }

    return spareParts.filter((sparePart) =>
      normalizeSearchValue(sparePart.nombre).includes(normalizedSearchTerm)
    );
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
          placeholder="Buscar repuestos..."
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="spare-parts-grid">
        {filteredSpareParts.map((sparePart) => (
          <article className="spare-part-card" key={sparePart.id}>
            <div className="spare-part-card__topline">
              <span className="spare-part-card__category">{sparePart.categoria}</span>
            </div>

            <div className="spare-part-card__content">
              <h2>{sparePart.nombre}</h2>
              <p>{sparePart.descripcion}</p>
            </div>

            <div className="spare-part-card__status">
              <span className="availability">{sparePart.disponibilidad}</span>
            </div>

            <Button
              href="https://wa.me/5490000000000"
              variant="primary"
              className="spare-part-card__button"
              target="_blank"
              rel="noreferrer"
            >
              Consultar
            </Button>
          </article>
        ))}
      </div>

      {filteredSpareParts.length === 0 ? (
        <p className="status-message spare-parts-empty">
          No se encontraron repuestos con ese nombre.
        </p>
      ) : null}
    </section>
  );
}

export default SparePartsPage;
