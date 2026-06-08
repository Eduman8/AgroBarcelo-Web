import { useEffect, useState } from 'react';
import { getMachineById } from '../data/machinesMock.js';
import { getSparePartById } from '../services/sparePartsService.js';
import { whatsappConfig } from '../config/contact.js';

const contactDetails = [
  {
    icon: '◉',
    title: 'WhatsApp',
    value: 'A definir'
  },
  {
    icon: '✉',
    title: 'Email',
    value: 'info@agrobarcelo.com.ar',
    href: 'mailto:info@agrobarcelo.com.ar'
  },
  {
    icon: '◎',
    title: 'Instagram',
    value: '@agrobarcelo'
  },
  {
    icon: '⌖',
    title: 'Ubicación',
    value: 'Armstrong, Santa Fe'
  }
];

const businessHours = [
  'Lunes a Viernes',
  '08:00 a 12:00',
  '14:00 a 18:00'
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
        <div className="contact-overview">
          <section className="contact-panel contact-panel--info" aria-labelledby="contact-info-title">
            <div className="contact-panel__heading">
              <p className="eyebrow">Datos de la empresa</p>
              <h2 id="contact-info-title">Información de contacto</h2>
              <p>Canales principales para recibir consultas comerciales y coordinar la atención.</p>
            </div>

            <div className="contact-detail-grid">
              {contactDetails.map((detail) => (
                <article className="contact-detail-card" key={detail.title}>
                  <span className="contact-detail-card__icon" aria-hidden="true">
                    {detail.icon}
                  </span>
                  <div>
                    <h3>{detail.title}</h3>
                    {detail.href ? (
                      <a className="contact-detail-card__value" href={detail.href}>
                        {detail.value}
                      </a>
                    ) : (
                      <p className="contact-detail-card__value">{detail.value}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="contact-side-stack">
            <section className="contact-panel contact-panel--hours" aria-labelledby="contact-hours-title">
              <div className="contact-panel__heading">
                <p className="eyebrow">Atención comercial</p>
                <h2 id="contact-hours-title">Horarios de atención</h2>
              </div>

              <ul className="contact-hours-list">
                {businessHours.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="contact-panel contact-panel--help" aria-labelledby="contact-help-title">
              <div className="contact-panel__heading">
                <p className="eyebrow">Asesoramiento</p>
                <h2 id="contact-help-title">¿Necesitás ayuda?</h2>
                <p>
                  Nuestro equipo puede ayudarte a encontrar repuestos, maquinaria o la mejor solución
                  para tu necesidad.
                </p>
              </div>

              <a
                className="button button--primary contact-help__button"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                Enviar consulta por WhatsApp
              </a>
            </section>
          </aside>
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
