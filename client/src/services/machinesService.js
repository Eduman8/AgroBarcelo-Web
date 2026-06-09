import { getMachineById, machinesMock } from '../data/machinesMock.js';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function withFallbackFlag(data) {
  const fallbackData = Array.isArray(data) ? [...data] : { ...data };

  return Object.defineProperty(fallbackData, 'isFallback', {
    value: true,
    enumerable: false
  });
}

function getMachineSlug(machine) {
  return machine?.slug ?? machine?.id;
}

function getFallbackMachineBySlug(slug) {
  const normalizedSlug = String(slug ?? '');

  return machinesMock.find((machine) => getMachineSlug(machine) === normalizedSlug) ?? getMachineById(normalizedSlug);
}

async function parseErrorMessage(response, fallbackMessage) {
  try {
    const errorBody = await response.json();

    return errorBody?.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

async function fetchJson(path, fallbackMessage, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, fallbackMessage));
  }

  return response.json();
}

export async function getMachines() {
  try {
    return await fetchJson('/api/maquinarias', 'No se pudieron cargar las maquinarias.');
  } catch {
    return withFallbackFlag(machinesMock);
  }
}

export async function getMachineBySlug(slug) {
  try {
    const machine = await fetchJson(
      `/api/maquinarias/${encodeURIComponent(slug)}`,
      'No se pudo cargar el detalle de la maquinaria.'
    );

    return machine;
  } catch {
    const fallbackMachine = getFallbackMachineBySlug(slug);

    return fallbackMachine ? withFallbackFlag(fallbackMachine) : null;
  }
}

export async function getAdminMachines() {
  try {
    return await fetchJson('/api/admin/maquinarias', 'No se pudieron cargar las maquinarias del admin.');
  } catch {
    return withFallbackFlag(machinesMock);
  }
}

export async function createMachine(data) {
  return fetchJson('/api/admin/maquinarias', 'No se pudo crear la maquinaria.', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateMachine(id, data) {
  const machine = await fetchJson(
    `/api/admin/maquinarias/${encodeURIComponent(id)}`,
    'No se pudo editar la maquinaria.',
    {
      method: 'PUT',
      body: JSON.stringify(data)
    }
  );

  if (!machine) {
    throw new Error('Maquinaria no encontrada.');
  }

  return machine;
}

export async function deleteMachine(id) {
  const machine = await fetchJson(
    `/api/admin/maquinarias/${encodeURIComponent(id)}`,
    'No se pudo eliminar la maquinaria.',
    {
      method: 'DELETE'
    }
  );

  if (!machine) {
    throw new Error('Maquinaria no encontrada.');
  }

  return machine;
}
