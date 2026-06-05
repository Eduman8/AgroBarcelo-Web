import { useEffect, useState } from 'react';
import { getMachineById } from '../data/machinesMock.js';
import { getSparePartById } from '../services/sparePartsService.js';
import { whatsappConfig } from '../config/contact.js';

const contactBlocks = [
  {
    icon: '◉',
    title: 'WhatsApp',
    text: 'Consultas comerciales y atención rápida.',
    action: {
      label: 'Enviar consulta por WhatsApp'
    }
  },
  {
    icon: '✉',
    title: 'Email',
    text: 'Enviá tu consulta y te responderemos a la brevedad.',
    detail: 'info@agrobarcelo.com.ar',
    href: 'mailto:info@agrobarcelo.com.ar'
  },
  {
    icon: '⌖',
    title: 'Ubicación',
    text: 'Armstrong, Santa Fe',
    detail: 'Dirección exacta a confirmar.'
  },
  {
    icon: '◷',
    title: 'Horarios',
    text: 'Lunes a viernes de 8:00 a 12:00 y de 15:00 a 19:00',
    detail: 'Sábados de 8:00 a 12:00'
  }
];

const emptyValue = 'Sin informar';

function getDisplayValue(value) {
  if (value === null || value === undefined || value === '') {
    return emptyValue;
  }

  return value;
}

function getAvailabilityLabel(isAvailable) {
  return isAvailable ? 'Disponible' : 'Trabajo realizado';
}

function normalizeWhatsAppPhoneNumber(phoneNumber) {
  return String(phoneNumber).replace(/\D/g, '');
}

function buildWhatsAppMessage({ sparePart, machine }) {
  if (sparePart) {
    return `Hola AgroBarceló, quiero consultar por el repuesto ${getDisplayValue(sparePart.nombre)} (código: ${getDisplayValue(sparePart.codigo)}).`;
  }

  if (machine) {
    return `Hola AgroBarceló, quiero consultar por la maquinaria ${machine.nombre}.`;
  }

  return 'Hola AgroBarceló, quiero hacer una consulta.';
}

function buildWhatsAppUrl(message) {
  const phoneNumber = normalizeWhatsAppPhoneNumber(whatsappConfig.phoneNumber);
  const params = new URLSearchParams({ text: message });

  return `https://wa.me/${phoneNumber}?${params.toString()}`;
}

function ContactPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const sparePartId = searchParams.get('producto');
  const machineId = searchParams.get('maquinaria');
  const selectedQueryType = sparePartId ? 'producto' : machineId ? 'maquinaria' : '';
  const [notice, setNotice] = useState('');
  const [subject, setSubject] = useState('');
  const [sparePart, setSparePart] = useState(null);
  const [isSparePartLoading, setIsSparePartLoading] = useState(false);
  const [sparePartError, setSparePartError] = useState('');
  const [wasSparePartNotFound, setWasSparePartNotFound] = useState(false);

  const machine = machineId ? getMachineById(machineId) : null;
  const wasMachineNotFound = Boolean(machineId && !machine);
  const whatsappUrl = buildWhatsAppUrl(buildWhatsAppMessage({ sparePart, machine }));

  useEffect(() => {
    if (selectedQueryType === 'producto') {
      setSubject('Consulta por repuesto');
      return;
    }

    if (selectedQueryType === 'maquinaria') {
      setSubject('Consulta por maquinaria');
      return;
    }

    setSubject('');
  }, [selectedQueryType]);

  useEffect(() => {
    if (!sparePartId) {
      setSparePart(null);
      setSparePartError('');
      setWasSparePartNotFound(false);
      setIsSparePartLoading(false);
      return undefined;
    }

    let isMounted = true;

    async function loadSparePart() {
      setIsSparePartLoading(true);
      setSparePartError('');
      setWasSparePartNotFound(false);

      try {
        const response = await getSparePartById(sparePartId);

        if (!isMounted) {
          return;
        }

        if (!response) {
          setSparePart(null);
          setWasSparePartNotFound(true);
          return;
        }

        setSparePart(response);
      } catch (currentError) {
        if (isMounted) {
          setSparePart(null);
          setSparePartError(currentError.message);
        }
      } finally {
        if (isMounted) {
          setIsSparePartLoading(false);
        }
      }
    }

    loadSparePart();

    return () => {
      isMounted = false;
    };
  }, [sparePartId]);

  function handleSubmit(event) {
    event.preventDefault();
    setNotice('El envío del formulario será habilitado próximamente.');
  }

  function renderSelectedQueryCard() {
    if (!selectedQueryType) {
      return null;
    }

    if (selectedQueryType === 'producto') {
      return (
        <article className="selected-query-card" aria-live="polite">
          <div className="selected-query-card__header">
            <p className="eyebrow">Consulta seleccionada</p>
            <h2>Consulta sobre repuesto</h2>
          </div>

          {isSparePartLoading && <p className="status-message">Cargando repuesto seleccionado...</p>}
          {sparePartError && <p className="status-message status-message--error">{sparePartError}</p>}
          {wasSparePartNotFound && (
            <p className="status-message status-message--error">
              No encontramos un repuesto con el identificador solicitado.
            </p>
          )}

          {!isSparePartLoading && !sparePartError && sparePart ? (
            <dl className="selected-query-card__details">
              <div>
                <dt>Nombre</dt>
                <dd>{getDisplayValue(sparePart.nombre)}</dd>
              </div>
              <div>
                <dt>Código</dt>
                <dd>{getDisplayValue(sparePart.codigo)}</dd>
              </div>
              <div>
                <dt>Marca</dt>
                <dd>{getDisplayValue(sparePart.marca)}</dd>
              </div>
              <div>
                <dt>Disponibilidad</dt>
                <dd>{getDisplayValue(sparePart.disponibilidad)}</dd>
              </div>
            </dl>
          ) : null}
        </article>
      );
    }

    return (
      <article className="selected-query-card" aria-live="polite">
        <div className="selected-query-card__header">
          <p className="eyebrow">Consulta seleccionada</p>
          <h2>Consulta sobre maquinaria</h2>
        </div>

        {wasMachineNotFound ? (
          <p className="status-message status-message--error">
            No encontramos una maquinaria con el identificador solicitado.
          </p>
        ) : null}

        {machine ? (
          <dl className="selected-query-card__details">
            <div>
              <dt>Nombre</dt>
              <dd>{machine.nombre}</dd>
            </div>
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
        ) : null}
      </article>
    );
  }

  return (
    <section className="contact-page" aria-labelledby="contact-title">
      <div className="contact-hero">
        <p className="eyebrow">Atención AgroBarceló</p>
        <h1 id="contact-title">Contacto</h1>
        <p>Comunicate con AgroBarceló para consultas sobre maquinarias, repuestos o servicios.</p>
      </div>

      <div className="contact-layout">
        <div className="contact-info" aria-label="Datos de contacto">
          {contactBlocks.map((block) => (
            <article className="contact-card" key={block.title}>
              <span className="contact-card__icon" aria-hidden="true">
                {block.icon}
              </span>
              <div className="contact-card__body">
                <h2>{block.title}</h2>
                <p>{block.text}</p>
                {block.href ? (
                  <a className="contact-card__detail" href={block.href}>
                    {block.detail}
                  </a>
                ) : null}
                {!block.href && block.detail ? (
                  <span className="contact-card__detail">{block.detail}</span>
                ) : null}
                {block.action ? (
                  <a
                    className="button button--primary contact-card__button"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {block.action.label}
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <div className="contact-form-column">
          {renderSelectedQueryCard()}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form__heading">
              <p className="eyebrow">Formulario de consulta</p>
              <h2>Dejanos tu mensaje</h2>
              <p>Completá tus datos y prepararemos este canal para responderte próximamente.</p>
            </div>

            <div className="contact-form__grid">
              <label>
                Nombre
                <input name="name" type="text" placeholder="Tu nombre" />
              </label>
              <label>
                Teléfono
                <input name="phone" type="tel" placeholder="Tu teléfono" />
              </label>
              <label>
                Email
                <input name="email" type="email" placeholder="tu@email.com" />
              </label>
              <label>
                Motivo de consulta
                <input
                  name="subject"
                  type="text"
                  value={subject}
                  placeholder="Maquinarias, repuestos o servicios"
                  onChange={(event) => setSubject(event.target.value)}
                />
              </label>
            </div>

            <label className="contact-form__message">
              Mensaje
              <textarea name="message" rows="6" placeholder="Contanos cómo podemos ayudarte" />
            </label>

            <button className="button button--primary contact-form__submit" type="submit">
              Enviar consulta
            </button>

            {notice ? <p className="contact-form__notice">{notice}</p> : null}
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;
