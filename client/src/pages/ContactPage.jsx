import { useState } from 'react';

const contactBlocks = [
  {
    icon: '◉',
    title: 'WhatsApp',
    text: 'Consultas comerciales y atención rápida.',
    action: {
      label: 'Enviar WhatsApp',
      href: 'https://wa.me/5490000000000'
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

function ContactPage() {
  const [notice, setNotice] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setNotice('El envío del formulario será habilitado próximamente.');
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
                    href={block.action.href}
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
              <input name="subject" type="text" placeholder="Maquinarias, repuestos o servicios" />
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
    </section>
  );
}

export default ContactPage;
