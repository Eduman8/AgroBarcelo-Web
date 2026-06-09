import { getSqlPool, sql } from '../config/sqlServer.js';

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 50;

const manualSparePartsSearchQuery = `
SELECT TOP (@limit)
    rm.Id AS id,
    rm.ManualNombre AS manual,
    rm.ArchivoOrigen AS archivoOrigen,
    rm.Pagina AS pagina,
    rm.Codigo AS codigo,
    rm.Descripcion AS descripcion,
    rm.Marca AS marca,
    rm.Modelo AS modelo,
    rm.Categoria AS categoria,
    rm.ReferenciaDespiece AS referenciaDespiece,
    rm.Observaciones AS observaciones
FROM dbo.RepuestosManuales rm
WHERE rm.Activo = 1
  AND (
    @search = ''
    OR rm.Codigo LIKE @searchTerm
    OR rm.Descripcion LIKE @searchTerm
    OR rm.ManualNombre LIKE @searchTerm
    OR rm.Marca LIKE @searchTerm
    OR rm.Modelo LIKE @searchTerm
    OR rm.Categoria LIKE @searchTerm
    OR rm.ReferenciaDespiece LIKE @searchTerm
  )
ORDER BY
    rm.ManualNombre,
    rm.Pagina,
    rm.Codigo;
`;

const parsePositiveInteger = (value, defaultValue) => {
  const parsedValue = Number.parseInt(value, 10);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : defaultValue;
};

const normalizeSearchOptions = ({ search = '', limit = DEFAULT_LIMIT } = {}) => {
  const normalizedSearch = String(search ?? '').trim().slice(0, 150);
  const normalizedLimit = Math.min(parsePositiveInteger(limit, DEFAULT_LIMIT), MAX_LIMIT);

  return {
    search: normalizedSearch,
    limit: normalizedLimit,
    searchTerm: `%${normalizedSearch}%`
  };
};

const getDisplayValue = (value, fallback = '') => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  return value;
};

const mapManualSparePart = (sparePart) => {
  const manual = getDisplayValue(sparePart.manual, 'Sin manual');
  const modelo = getDisplayValue(sparePart.modelo, 'Sin modelo');

  return {
    id: sparePart.id,
    manual,
    manualNombre: manual,
    archivoOrigen: getDisplayValue(sparePart.archivoOrigen),
    pagina: sparePart.pagina,
    codigo: getDisplayValue(sparePart.codigo, 'Sin código'),
    descripcion: getDisplayValue(sparePart.descripcion, 'Sin descripción'),
    marca: getDisplayValue(sparePart.marca, 'Sin marca'),
    modelo,
    modeloMaquina: modelo,
    categoria: getDisplayValue(sparePart.categoria, 'Sin categoría'),
    referenciaDespiece: getDisplayValue(sparePart.referenciaDespiece),
    observaciones: getDisplayValue(sparePart.observaciones)
  };
};

export const searchManualSpareParts = async (options = {}) => {
  const pool = await getSqlPool();
  const searchOptions = normalizeSearchOptions(options);
  const result = await pool
    .request()
    .input('limit', sql.Int, searchOptions.limit)
    .input('search', sql.NVarChar(150), searchOptions.search)
    .input('searchTerm', sql.NVarChar(152), searchOptions.searchTerm)
    .query(manualSparePartsSearchQuery);

  return {
    data: (result.recordset ?? []).map(mapManualSparePart),
    meta: {
      search: searchOptions.search,
      limit: searchOptions.limit
    }
  };
};
