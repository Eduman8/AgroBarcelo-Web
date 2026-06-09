export function getMachineSlug(machine) {
  return machine?.slug ?? machine?.id;
}

export function isSoldMachine(machine) {
  return String(machine?.estado ?? '').trim().toLocaleLowerCase('es-AR') === 'vendido';
}

export function getMachineAvailabilityLabel(machine, unavailableLabel = 'No disponible') {
  if (isSoldMachine(machine)) {
    return 'Vendido';
  }

  return machine?.disponible ? 'Disponible' : unavailableLabel;
}
