import { getSpareParts, getSparePartsCount } from '../services/sparePartsService.js';

const sanitizeLogValue = (value) => {
  if (value === undefined || value === null) {
    return value;
  }

  let sanitizedValue = String(value);

  [process.env.DB_USER, process.env.DB_PASSWORD].filter(Boolean).forEach((sensitiveValue) => {
    sanitizedValue = sanitizedValue.replaceAll(sensitiveValue, '[redacted]');
  });

  return sanitizedValue.replace(/user\s+'[^']*'/gi, "user '[redacted]'");
};

export const getSparePartsCountController = async (request, response) => {
  try {
    const sparePartsCount = await getSparePartsCount();

    response.json(sparePartsCount);
  } catch (error) {
    const diagnosticError = error?.cause || error;

    console.error('[spare-parts-count] SQL Server query error', {
      message: sanitizeLogValue(diagnosticError?.message),
      code: sanitizeLogValue(diagnosticError?.code),
      originalErrorMessage: sanitizeLogValue(diagnosticError?.originalError?.message),
      originalErrorCode: sanitizeLogValue(diagnosticError?.originalError?.code)
    });

    response.status(500).json({
      status: 'error',
      message: 'No se pudo obtener el total de repuestos.'
    });
  }
};

export const getSparePartsController = async (request, response) => {
  try {
    const spareParts = await getSpareParts();

    response.json(spareParts);
  } catch (error) {
    const diagnosticError = error?.cause || error;

    console.error('[spare-parts] SQL Server query error', {
      message: sanitizeLogValue(diagnosticError?.message),
      code: sanitizeLogValue(diagnosticError?.code),
      originalErrorMessage: sanitizeLogValue(diagnosticError?.originalError?.message),
      originalErrorCode: sanitizeLogValue(diagnosticError?.originalError?.code)
    });

    response.status(500).json({
      status: 'error',
      message: 'No se pudieron obtener los repuestos.'
    });
  }
};
