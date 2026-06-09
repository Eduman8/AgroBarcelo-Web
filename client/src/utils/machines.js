export const machineCategories = ['Nueva', 'Usada', 'Trabajo Realizado'];
export const machineStatuses = ['Disponible', 'Vendida'];

const categoryAliases = new Map([
  ['maquinaria nueva', 'Nueva'],
  ['nueva', 'Nueva'],
  ['maquinaria usada', 'Usada'],
  ['usada', 'Usada'],
  ['usado', 'Usada'],
  ['trabajos realizados', 'Trabajo Realizado'],
  ['trabajo realizado', 'Trabajo Realizado']
]);

const statusAliases = new Map([
  ['disponible', 'Disponible'],
  ['vendida', 'Vendida'],
  ['vendido', 'Vendida'],
  ['finalizado', 'Vendida'],
  ['finalizada', 'Vendida'],
  ['trabajos realizados', 'Vendida'],
  ['trabajo realizado', 'Vendida'],
  ['nueva', 'Disponible'],
  ['usada', 'Disponible'],
  ['usado', 'Disponible']
]);

function normalizeKey(value) {
  return String(value ?? '').trim().toLocaleLowerCase('es-AR');
}

export function normalizeMachineCategory(value) {
  return categoryAliases.get(normalizeKey(value)) ?? String(value ?? '').trim();
}

export function normalizeMachineStatus(value, machine) {
  const normalizedStatus = statusAliases.get(normalizeKey(value));

  if (normalizedStatus) {
    return normalizedStatus;
  }

  return machine?.disponible === false ? 'Vendida' : String(value ?? '').trim();
}

export function getMachineCategory(machine) {
  return normalizeMachineCategory(machine?.categoria);
}

export function getMachineStatus(machine) {
  return normalizeMachineStatus(machine?.estado, machine);
}

export function getMachineSlug(machine) {
  return machine?.slug ?? machine?.id;
}

export function isSoldMachine(machine) {
  return getMachineStatus(machine) === 'Vendida';
}

export function isAvailableMachine(machine) {
  return !isSoldMachine(machine) && machine?.disponible !== false;
}

export function getMachineAvailabilityLabel(machine, unavailableLabel = 'No disponible') {
  return isAvailableMachine(machine) ? 'Disponible' : unavailableLabel;
}
