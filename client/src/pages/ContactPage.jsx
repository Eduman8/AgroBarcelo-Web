import { useEffect, useState } from 'react';
import { getMachineById } from '../data/machinesMock.js';
import { getSparePartById } from '../services/sparePartsService.js';
import { mapsConfig, whatsappConfig } from '../config/contact.js';
import { getContactSelectedParts, removeContactSelectedPart } from '../utils/contactSelectedParts.js';
import { getMachineAvailabilityLabel, getMachineCategory, getMachineStatus } from '../utils/machines.js';

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
    value: ['San Luis 759', 'Armstrong, Santa Fe'],
    href: mapsConfig.locationUrl,
    target: '_blank',
    rel: 'noreferrer',
    actionLabel: 'Ver en Google Maps',
    fullCardLink: true
  }
];

const businessHours = [
  'Lunes a Viernes',
  '08:00 a 12:00',
  '14:00 a 18:00'
];

const emptyValue = 'Sin informar';

const initialFormValues = {
  name: '',
  phone: '',
  email: '',
  message: ''
};

function getDisplayValue(value) {
  if (value === null || value === undefined || value === '') {
    return emptyValue;
  }

  return value;
}

function normalizeWhatsAppPhoneNumber(phoneNumber) {
  return String(phoneNumber).replace(/\D/g, '');
}

function buildWhatsAppMessage({ sparePart, machine, selectedParts }) {
  if (sparePart) {
    return `Hola AgroBarceló, quiero consultar por el repuesto ${getDisplayValue(sparePart.nombre)} (código: ${getDisplayValue(sparePart.codigo)}).`;
  }

  if (machine) {
    return `Hola AgroBarceló, quiero consultar por la maquinaria ${machine.nombre}.`;
  }

  if (selectedParts.length > 0) {
    return `Hola AgroBarceló, quiero consultar por ${selectedParts.length} repuesto${selectedParts.length === 1 ? '' : 's'}.`;
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
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formStatus, setFormStatus] = useState('idle');
  const [notice, setNotice] = useState('');
  const [subject, setSubject] = useState('');
  const [sparePart, setSparePart] = useState(null);
  const [isSparePartLoading, setIsSparePartLoading] = useState(false);
  const [sparePartError, setSparePartError] = useState('');
  const [wasSparePartNotFound, setWasSparePartNotFound] = useState(false);
  const [selectedParts, setSelectedParts] = useState(() => getContactSelectedParts());

  const machine = machineId ? getMachineById(machineId) : null;
  const wasMachineNotFound = Boolean(machineId && !machine);
  const whatsappUrl = buildWhatsAppUrl(buildWhatsAppMessage({ sparePart, machine, selectedParts }));

  useEffect(() => {
    if (selectedQueryType === 'producto') {
      setSubject('Consulta por repuesto');
      return;
    }

    if (selectedQueryType === 'maquinaria') {
      setSubject('Consulta por maquinaria');
      return;
    }

    if (selectedParts.length > 0) {
      setSubject('Consulta por repuesto');
      return;
    }

    setSubject('');
  }, [selectedQueryType, selectedParts.length]);

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

  function buildSelectedPartsPayload() {
    return selectedParts.map((selectedPart) => ({
      id: selectedPart.id,
      name: selectedPart.nombre,
      code: selectedPart.codigo
    }));
  }

  function buildContactContext() {
    if (sparePartId) {
      return {
        type: 'repuesto',
        id: sparePartId,
        name: sparePart?.nombre || '',
        code: sparePart?.codigo || '',
        brand: sparePart?.marca || ''
      };
    }

    if (machineId) {
      return {
        type: 'maquinaria',
        id: machineId,
        name: machine?.nombre || '',
        code: '',
        brand: ''
      };
    }

    return {
      type: 'general',
      id: '',
      name: '',
      code: '',
      brand: ''
    };
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormStatus('sending');
    setNotice('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formValues,
          subject,
          context: buildContactContext(),
          selectedParts: buildSelectedPartsPayload()
        })
      });

      if (!response.ok) {
        throw new Error('No se pudo enviar la consulta.');
      }

      setFormStatus('success');
      setNotice('Consulta enviada correctamente. Te responderemos a la brevedad.');
      setFormValues(initialFormValues);

      if (!selectedQueryType && selectedParts.length === 0) {
        setSubject('');
      }
    } catch (currentError) {
      setFormStatus('error');
      setNotice('No se pudo enviar la consulta. Intentá nuevamente o contactanos por WhatsApp.');
    }
  }

  function handleClearSelectedQuery() {
    window.location.href = '/contacto';
  }

  function handleRemoveSelectedPart(partId) {
    setSelectedParts(removeContactSelectedPart(partId));
  }

  function renderClearSelectedQueryButton() {
    return (
      <button className="selected-query-card__clear" type="button" onClick={handleClearSelectedQuery}>
        Limpiar consulta
      </button>
    );
  }

  function renderSelectedQueryCard() {
    if (!selectedQueryType) {
      return null;
    }

    if (selectedQueryType === 'producto') {
      return (
        <article className="selected-query-card" aria-live="polite">
          <div className="selected-query-card__header">
            <div>
              <p className="eyebrow">Consulta seleccionada</p>
              <h2>Consulta sobre repuesto</h2>
            </div>
            {renderClearSelectedQueryButton()}
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
          <div>
            <p className="eyebrow">Consulta seleccionada</p>
            <h2>Consulta sobre maquinaria</h2>
          </div>
          {renderClearSelectedQueryButton()}
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
              <dd>{getMachineCategory(machine)}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{getMachineStatus(machine)}</dd>
            </div>
            <div>
              <dt>Disponibilidad</dt>
              <dd>{getMachineAvailabilityLabel(machine)}</dd>
            </div>
          </dl>
        ) : null}
      </article>
    );
  }

  function renderSelectedParts() {
    if (selectedParts.length === 0) {
      return null;
    }

    return (
      <article className="selected-query-card selected-parts-card" aria-labelledby="selected-parts-title">
        <div className="selected-query-card__header">
          <div>
            <p className="eyebrow">Repuestos seleccionados</p>
            <h2 id="selected-parts-title">Repuestos seleccionados</h2>
          </div>
        </div>

        <ul className="selected-parts-list">
          {selectedParts.map((selectedPart) => (
            <li key={selectedPart.id}>
              <span>
                <span aria-hidden="true">✓</span> {getDisplayValue(selectedPart.nombre)}
              </span>
              <button type="button" onClick={() => handleRemoveSelectedPart(selectedPart.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
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
              {contactDetails.map((detail) => {
                const CardTag = detail.fullCardLink ? 'a' : 'article';
                const cardProps = detail.fullCardLink
                  ? {
                      href: detail.href,
                      target: detail.target,
                      rel: detail.rel,
                      'aria-label': `${detail.actionLabel}: ${detail.value.join(', ')}`
                    }
                  : {};
                const valueLines = Array.isArray(detail.value) ? detail.value : [detail.value];

                return (
                  <CardTag
                    className={`contact-detail-card${detail.fullCardLink ? ' contact-detail-card--link' : ''}`}
                    key={detail.title}
                    {...cardProps}
                  >
                    <span className="contact-detail-card__icon" aria-hidden="true">
                      {detail.icon}
                    </span>
                    <div>
                      <h3>{detail.title}</h3>
                      {detail.href && !detail.fullCardLink ? (
                        <a className="contact-detail-card__value" href={detail.href}>
                          {detail.value}
                        </a>
                      ) : (
                        <p className="contact-detail-card__value">
                          {valueLines.map((line) => (
                            <span key={line}>{line}</span>
                          ))}
                        </p>
                      )}
                      {detail.actionLabel ? (
                        <span className="contact-detail-card__action">{detail.actionLabel}</span>
                      ) : null}
                    </div>
                  </CardTag>
                );
              })}
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
          {renderSelectedParts()}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form__heading">
              <p className="eyebrow">Formulario de consulta</p>
              <h2>Dejanos tu mensaje</h2>
              <p>Completá tus datos y te responderemos a la brevedad.</p>
            </div>

            <div className="contact-form__grid">
              <label>
                Nombre
                <input
                  name="name"
                  type="text"
                  value={formValues.name}
                  placeholder="Tu nombre"
                  onChange={handleFieldChange}
                />
              </label>
              <label>
                Teléfono
                <input
                  name="phone"
                  type="tel"
                  value={formValues.phone}
                  placeholder="Tu teléfono"
                  onChange={handleFieldChange}
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={formValues.email}
                  placeholder="tu@email.com"
                  onChange={handleFieldChange}
                />
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
              <textarea
                name="message"
                rows="6"
                value={formValues.message}
                placeholder="Contanos cómo podemos ayudarte"
                onChange={handleFieldChange}
              />
            </label>

            <button
              className="button button--primary contact-form__submit"
              type="submit"
              disabled={formStatus === 'sending'}
            >
              {formStatus === 'sending' ? 'Enviando consulta...' : 'Enviar consulta'}
            </button>

            {notice ? (
              <p className={`contact-form__notice contact-form__notice--${formStatus}`} aria-live="polite">
                {notice}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;
