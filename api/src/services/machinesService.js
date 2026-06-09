import { getSqlPool, sql } from '../config/sqlServer.js';

const publicMachinesQuery = `
SELECT
    ID_WebMaquinaria AS id,
    Slug AS slug,
    Nombre AS nombre,
    Categoria AS categoria,
    Estado AS estado,
    DescripcionCorta AS descripcionCorta,
    DescripcionLarga AS descripcionLarga,
    ImagenPrincipal AS imagenPrincipal,
    Galeria AS galeria,
    Disponible AS disponible,
    Activo AS activo
FROM dbo.WebMaquinarias
WHERE Activo = 1
  AND (
    Disponible = 1
    OR LOWER(LTRIM(RTRIM(Estado))) IN (N'vendido', N'vendida', N'finalizado', N'finalizada', N'trabajo realizado', N'trabajos realizados')
    OR LOWER(LTRIM(RTRIM(Categoria))) IN (N'trabajo realizado', N'trabajos realizados')
  )
ORDER BY FechaAlta DESC, ID_WebMaquinaria DESC;
`;

const publicMachineByIdentifierQuery = `
SELECT TOP (1)
    ID_WebMaquinaria AS id,
    Slug AS slug,
    Nombre AS nombre,
    Categoria AS categoria,
    Estado AS estado,
    DescripcionCorta AS descripcionCorta,
    DescripcionLarga AS descripcionLarga,
    ImagenPrincipal AS imagenPrincipal,
    Galeria AS galeria,
    Disponible AS disponible,
    Activo AS activo
FROM dbo.WebMaquinarias
WHERE Activo = 1
  AND (Slug = @identifier OR (@id IS NOT NULL AND ID_WebMaquinaria = @id))
ORDER BY
    CASE WHEN Slug = @identifier THEN 0 ELSE 1 END,
    ID_WebMaquinaria DESC;
`;

export const parseGallery = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value || typeof value !== 'string') {
    return [];
  }

  try {
    const parsedValue = JSON.parse(value);

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

export const normalizeGalleryForStorage = (value) => JSON.stringify(parseGallery(value));

const normalizeMachineTextKey = (value) => String(value ?? '').trim().toLocaleLowerCase('es-AR');

const normalizeMachineCategory = (value) => {
  const categoryAliases = new Map([
    ['maquinaria nueva', 'Nueva'],
    ['nueva', 'Nueva'],
    ['maquinaria usada', 'Usada'],
    ['usada', 'Usada'],
    ['usado', 'Usada'],
    ['trabajos realizados', 'Trabajo Realizado'],
    ['trabajo realizado', 'Trabajo Realizado']
  ]);

  return categoryAliases.get(normalizeMachineTextKey(value)) ?? String(value ?? '').trim();
};

const normalizeMachineStatus = (value, machine) => {
  if (normalizeMachineCategory(machine?.categoria) === 'Trabajo Realizado') {
    return 'Trabajo Realizado';
  }

  const statusAliases = new Map([
    ['disponible', 'Disponible'],
    ['vendida', 'Vendida'],
    ['vendido', 'Vendida'],
    ['finalizado', 'Vendida'],
    ['finalizada', 'Vendida'],
    ['trabajos realizados', 'Trabajo Realizado'],
    ['trabajo realizado', 'Trabajo Realizado'],
    ['nueva', 'Nueva'],
    ['nuevo', 'Nueva'],
    ['usada', 'Usada'],
    ['usado', 'Usada']
  ]);
  const normalizedStatus = statusAliases.get(normalizeMachineTextKey(value));

  if (normalizedStatus) {
    return normalizedStatus;
  }

  return machine?.disponible === false ? 'Vendida' : String(value ?? '').trim();
};

export const isSoldMachine = (machine) => normalizeMachineStatus(machine?.estado, machine) === 'Vendida';

export const isHistoricalWorkMachine = (machine) =>
  normalizeMachineCategory(machine?.categoria) === 'Trabajo Realizado' ||
  normalizeMachineStatus(machine?.estado, machine) === 'Trabajo Realizado';

export const isAvailableMachine = (machine) =>
  !isSoldMachine(machine) && !isHistoricalWorkMachine(machine) && Boolean(machine?.disponible);

export const mapMachine = (machine) => ({
  id: machine.id,
  slug: String(machine.slug ?? '').trim() || String(machine.id ?? ''),
  nombre: machine.nombre,
  categoria: normalizeMachineCategory(machine.categoria),
  estado: normalizeMachineStatus(machine.estado, machine),
  descripcionCorta: machine.descripcionCorta ?? null,
  descripcionLarga: machine.descripcionLarga ?? null,
  imagenPrincipal: machine.imagenPrincipal ?? null,
  galeria: parseGallery(machine.galeria),
  disponible: isAvailableMachine(machine),
  activo: Boolean(machine.activo)
});

export const getMachines = async () => {
  const pool = await getSqlPool();
  const result = await pool.request().query(publicMachinesQuery);

  return (result.recordset ?? []).map(mapMachine);
};

const parsePositiveInteger = (value) => {
  if (!/^\d+$/.test(String(value ?? '').trim())) {
    return null;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
};

export const getMachineBySlug = async (identifier) => {
  const normalizedIdentifier = String(identifier ?? '').trim().slice(0, 150);

  if (!normalizedIdentifier) {
    return null;
  }

  const pool = await getSqlPool();
  const result = await pool
    .request()
    .input('identifier', sql.NVarChar(150), normalizedIdentifier)
    .input('id', sql.Int, parsePositiveInteger(normalizedIdentifier))
    .query(publicMachineByIdentifierQuery);
  const machine = result.recordset?.[0];

  return machine ? mapMachine(machine) : null;
};
