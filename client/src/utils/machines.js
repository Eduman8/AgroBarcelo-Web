export const machineCategories = ['Nueva', 'Usada', 'Trabajo Realizado'];
export const machineStatuses = ['Disponible', 'Vendida'];

const workCategory = 'Trabajo Realizado';
const soldStatus = 'Vendida';
const availableStatus = 'Disponible';

const categoryAliases = new Map([
  ['maquinaria nueva', 'Nueva'],
  ['nueva', 'Nueva'],
  ['nuevo', 'Nueva'],
  ['maquinaria usada', 'Usada'],
  ['usada', 'Usada'],
  ['usado', 'Usada'],
  ['trabajos realizados', workCategory],
  ['trabajo realizado', workCategory]
]);

const statusAliases = new Map([
  ['disponible', availableStatus],
  ['vendida', soldStatus],
  ['vendido', soldStatus],
  ['finalizado', soldStatus],
  ['finalizada', soldStatus],
  ['nueva', 'Nueva'],
  ['nuevo', 'Nueva'],
  ['usada', 'Usada'],
  ['usado', 'Usada'],
  ['trabajos realizados', workCategory],
  ['trabajo realizado', workCategory]
]);

function normalizeKey(value) {
  return String(value ?? '').trim().toLocaleLowerCase('es-AR');
}

export function normalizeMachineCategory(value) {
  return categoryAliases.get(normalizeKey(value)) ?? String(value ?? '').trim();
}

export function normalizeMachineStatus(value, machine) {
  if (normalizeMachineCategory(machine?.categoria) === workCategory) {
    return workCategory;
  }

  const normalizedStatus = statusAliases.get(normalizeKey(value));

  if (normalizedStatus) {
    return normalizedStatus;
  }

  return machine?.disponible === false ? soldStatus : String(value ?? '').trim();
}

export function getMachineCategory(machine) {
  const normalizedCategory = normalizeMachineCategory(machine?.categoria);

  if (normalizedCategory) {
    return normalizedCategory;
  }

  const normalizedStatus = normalizeMachineStatus(machine?.estado, machine);

  return normalizedStatus === soldStatus || normalizedStatus === availableStatus ? '' : normalizedStatus;
}

export function getMachineStatus(machine) {
  return normalizeMachineStatus(machine?.estado, machine);
}

export function getMachineSlug(machine) {
  return String(machine?.slug ?? '').trim() || machine?.id;
}

export function isSoldMachine(machine) {
  return getMachineStatus(machine) === soldStatus;
}

export function isHistoricalWorkMachine(machine) {
  return getMachineCategory(machine) === workCategory || getMachineStatus(machine) === workCategory;
}

export function isAvailableMachine(machine) {
  return !isSoldMachine(machine) && !isHistoricalWorkMachine(machine) && machine?.disponible !== false;
}

export function getMachineAvailabilityLabel(machine, unavailableLabel = 'No disponible para consulta') {
  return isAvailableMachine(machine) ? availableStatus : unavailableLabel;
}

export function getMachineBadges(machine) {
  const badges = [getMachineCategory(machine), getMachineStatus(machine)]
    .filter(Boolean)
    .filter((badge) => badge !== availableStatus);

  return [...new Set(badges)];
}
