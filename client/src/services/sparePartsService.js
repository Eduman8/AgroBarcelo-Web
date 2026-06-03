const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getSpareParts({ page = 1, limit = 50, search = '' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });

  if (search.trim()) {
    params.set('search', search.trim());
  }

  const response = await fetch(`${apiUrl}/api/repuestos?${params.toString()}`);

  if (!response.ok) {
    throw new Error('No se pudieron cargar los repuestos.');
  }

  return response.json();
}
