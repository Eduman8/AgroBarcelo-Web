import { getSqlPool } from '../config/sqlServer.js';

export const getDbHealth = async (request, response) => {
  try {
    const pool = await getSqlPool();
    const queryResult = await pool.request().query('SELECT 1 AS ok');
    const result = queryResult.recordset?.[0]?.ok;

    response.json({
      status: 'ok',
      database: process.env.DB_DATABASE,
      result
    });
  } catch (error) {
    response.status(500).json({
      status: 'error',
      message: error.message || 'No se pudo validar la conexión con SQL Server.'
    });
  }
};
