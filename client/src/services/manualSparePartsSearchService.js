import { apiUrl } from './sparePartsService.js';

export async function searchManualSpareParts({ search = '', limit = 25 } = {}) {
  const params = new URLSearchParams({
    limit: String(limit)
  });
  const normalizedSearch = search.trim();

  if (normalizedSearch) {
    params.set('search', normalizedSearch);
  }

  const response = await fetch(`${apiUrl}/api/buscador-repuestos?${params.toString()}`);

  if (!response.ok) {
    throw new Error('No se pudo buscar en los repuestos manuales.');
  }

  return response.json();
}

export async function getManualSparePartsDiagnostics() {
  const response = await fetch(`${apiUrl}/api/buscador-repuestos/diagnostico`);

  if (!response.ok) {
    throw new Error('No se pudo obtener el estado de datos de repuestos manuales.');
  }

  return response.json();
}

export async function searchVisualSpareParts({ manual = '', pagina = '', elemento = '', limit = 25 } = {}) {
  const params = new URLSearchParams({
    manual: String(manual).trim(),
    pagina: String(pagina).trim(),
    elemento: String(elemento).trim(),
    limit: String(limit)
  });

  const response = await fetch(`${apiUrl}/api/buscador-visual-repuestos?${params.toString()}`);

  if (!response.ok) {
    throw new Error('No se pudo buscar el repuesto visual en los manuales.');
  }

  return response.json();
}
