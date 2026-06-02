import Button from '../components/ui/Button.jsx';

const machineCategories = ['Tractores', 'Sembradoras', 'Rastras', 'Implementos'];

const machines = [
  {
    name: 'Tractor Massey Ferguson',
    type: 'Tractores',
    status: 'Usada',
    price: 'Consultar precio',
    availability: 'Disponible',
    description: 'Unidad seleccionada para tareas generales de campo, con potencia y confiabilidad.'
  },
  {
    name: 'Sembradora CELE',
    type: 'Sembradoras',
    status: 'Nueva',
    price: 'Consultar precio',
    availability: 'Disponible',
    description: 'Equipo preparado para siembra eficiente y uniforme en distintas condiciones de trabajo.'
  },
  {
    name: 'Rastra de discos',
    type: 'Rastras',
    status: 'Usada',
    price: 'Consultar precio',
    availability: 'Disponible',
    description: 'Implemento robusto para preparación de suelo y mantenimiento de lotes productivos.'
  },
  {
    name: 'Implemento agrícola',
    type: 'Implementos',
    status: 'Nueva',
    price: 'Consultar precio',
    availability: 'Disponible',
    description: 'Solución práctica para complementar labores agropecuarias durante todo el año.'
  }
];

function MachinesPage() {
  return (
    <section className="machines-page" aria-labelledby="machines-title">
      <div className="machines-hero">
        <p className="eyebrow">Catálogo AgroBarceló</p>
        <h1 id="machines-title">Maquinarias</h1>
        <p>Maquinarias nuevas y usadas para el trabajo agropecuario.</p>
      </div>

      <div className="machines-filter" aria-label="Categorías de maquinarias">
        {machineCategories.map((category) => (
          <span className="machines-filter__item" key={category}>
            {category}
          </span>
        ))}
      </div>

      <div className="machines-grid">
        {machines.map((machine) => (
          <article className="machine-card" key={machine.name}>
            <div className="machine-card__topline">
              <span className="machine-card__type">{machine.type}</span>
              <span className="machine-card__status">{machine.status}</span>
            </div>

            <div className="machine-card__content">
              <h2>{machine.name}</h2>
              <p>{machine.description}</p>
            </div>

            <div className="machine-card__details">
              <span className="availability">{machine.availability}</span>
              <strong>{machine.price}</strong>
            </div>

            <Button
              href="https://wa.me/5490000000000"
              variant="primary"
              className="machine-card__button"
              target="_blank"
              rel="noreferrer"
            >
              Consultar
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MachinesPage;
