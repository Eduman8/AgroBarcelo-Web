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
  )
ORDER BY FechaAlta DESC, ID_WebMaquinaria DESC;
`;

const publicMachineBySlugQuery = `
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
  AND Slug = @slug;
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
  const normalizedStatus = statusAliases.get(normalizeMachineTextKey(value));

  if (normalizedStatus) {
    return normalizedStatus;
  }

  return machine?.disponible === false ? 'Vendida' : String(value ?? '').trim();
};

export const isSoldMachine = (machine) => normalizeMachineStatus(machine?.estado, machine) === 'Vendida';

export const mapMachine = (machine) => ({
  id: machine.id,
  slug: machine.slug,
  nombre: machine.nombre,
  categoria: normalizeMachineCategory(machine.categoria),
  estado: normalizeMachineStatus(machine.estado, machine),
  descripcionCorta: machine.descripcionCorta ?? null,
  descripcionLarga: machine.descripcionLarga ?? null,
  imagenPrincipal: machine.imagenPrincipal ?? null,
  galeria: parseGallery(machine.galeria),
  disponible: !isSoldMachine(machine) && Boolean(machine.disponible),
  activo: Boolean(machine.activo)
});

export const getMachines = async () => {
  const pool = await getSqlPool();
  const result = await pool.request().query(publicMachinesQuery);

  return (result.recordset ?? []).map(mapMachine);
};

export const getMachineBySlug = async (slug) => {
  const normalizedSlug = String(slug ?? '').trim().slice(0, 150);

  if (!normalizedSlug) {
    return null;
  }

  const pool = await getSqlPool();
  const result = await pool
    .request()
    .input('slug', sql.NVarChar(150), normalizedSlug)
    .query(publicMachineBySlugQuery);
  const machine = result.recordset?.[0];

  return machine ? mapMachine(machine) : null;
};
