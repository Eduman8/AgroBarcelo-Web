import { getSqlPool } from '../config/sqlServer.js';

const sparePartsCountQuery = `
SELECT COUNT(*) AS total
FROM Productos p
WHERE p.ID_Rubro IN (3,4,8,11,13,24,26,27)
`;

const sparePartsQuery = `
SELECT
    p.ID_Articulo AS id,
    p.Descripcion AS nombre,
    p.CodigoAlternativo AS codigo,
    p.ID_Rubro AS idRubro,
    r.Descripcion AS rubro,
    p.ID_SubRubro AS idSubRubro,
    sr.Descripcion AS subRubro,
    p.ID_Marca AS idMarca,
    m.Marca AS marca,
    ISNULL(s.Cantidad, 0) AS stock
FROM dbo.Productos p
LEFT JOIN dbo.Rubros r
    ON r.ID_Rubro = p.ID_Rubro
LEFT JOIN dbo.SubRubros sr
    ON sr.ID_SubRubro = p.ID_SubRubro
LEFT JOIN dbo.Marcas m
    ON m.ID_Marca = p.ID_Marca
LEFT JOIN dbo.vwStockExistencia s
    ON s.ID_Articulo = p.ID_Articulo
WHERE p.ID_Rubro IN (3, 4, 8, 11, 13, 24, 26, 27)
ORDER BY p.Descripcion;
`;

const getDisplayValue = (value, fallback) => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  return value;
};

const mapSparePart = (sparePart) => ({
  id: sparePart.id,
  nombre: sparePart.nombre,
  codigo: sparePart.codigo,
  rubro: getDisplayValue(sparePart.rubro, 'Sin rubro'),
  subRubro: getDisplayValue(sparePart.subRubro, 'Sin subrubro'),
  marca: getDisplayValue(sparePart.marca, 'Sin marca'),
  disponibilidad: 'Disponible'
});

export const getSparePartsCount = async () => {
  const pool = await getSqlPool();
  const result = await pool.request().query(sparePartsCountQuery);

  return { total: result.recordset?.[0]?.total ?? 0 };
};

export const getSpareParts = async () => {
  const pool = await getSqlPool();
  const result = await pool.request().query(sparePartsQuery);

  return (result.recordset ?? []).map(mapSparePart);
};
