import { sendContactEmail } from '../services/contactEmailService.js';

const requiredFieldsMessage = 'Completá todos los campos obligatorios.';
const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isBlank(value) {
  return typeof value !== 'string' || value.trim() === '';
}

function normalizeContext(context) {
  if (!context || typeof context !== 'object') {
    return null;
  }

  return {
    type: context.type ? String(context.type).trim() : '',
    id: context.id ? String(context.id).trim() : '',
    name: context.name ? String(context.name).trim() : '',
    code: context.code ? String(context.code).trim() : '',
    brand: context.brand ? String(context.brand).trim() : ''
  };
}

function validateContactData({ name, phone, email, subject, message }) {
  return !(
    isBlank(name) ||
    isBlank(phone) ||
    isBlank(email) ||
    !emailFormatRegex.test(email.trim()) ||
    isBlank(subject) ||
    isBlank(message)
  );
}

export async function createContactRequest(request, response) {
  const { name, phone, email, subject, message, context } = request.body || {};

  if (!validateContactData({ name, phone, email, subject, message })) {
    return response.status(400).json({
      status: 'error',
      message: requiredFieldsMessage
    });
  }

  const contactData = {
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
    context: normalizeContext(context)
  };

  try {
    await sendContactEmail(contactData);

    return response.json({
      status: 'ok',
      message: 'Consulta enviada correctamente.'
    });
  } catch (error) {
    console.error('Error enviando consulta de contacto:', {
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      stack: error.stack
    });

    return response.status(500).json({
      status: 'error',
      message: 'No se pudo enviar la consulta. Intentá nuevamente más tarde.'
    });
  }
}
