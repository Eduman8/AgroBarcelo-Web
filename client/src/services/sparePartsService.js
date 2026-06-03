const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getSpareParts() {
  const response = await fetch(`${apiUrl}/api/repuestos`);

  if (!response.ok) {
    throw new Error('No se pudieron cargar los repuestos.');
  }

  return response.json();
}
