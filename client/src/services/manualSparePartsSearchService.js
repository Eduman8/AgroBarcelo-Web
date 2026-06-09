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
