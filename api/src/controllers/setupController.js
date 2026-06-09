import { getSqlPool } from '../config/sqlServer.js';

const webMachinesSetupQuery = `
IF NOT EXISTS (
    SELECT 1
    FROM sys.tables t
    INNER JOIN sys.schemas s
        ON s.schema_id = t.schema_id
    WHERE t.name = N'WebMaquinarias'
      AND s.name = N'dbo'
)
BEGIN
    CREATE TABLE dbo.WebMaquinarias (
        ID_WebMaquinaria INT IDENTITY(1,1) PRIMARY KEY,
        Slug NVARCHAR(150) NOT NULL UNIQUE,
        Nombre NVARCHAR(200) NOT NULL,
        Categoria NVARCHAR(100) NOT NULL,
        Estado NVARCHAR(100) NOT NULL,
        DescripcionCorta NVARCHAR(500) NULL,
        DescripcionLarga NVARCHAR(MAX) NULL,
        ImagenPrincipal NVARCHAR(500) NULL,
        Galeria NVARCHAR(MAX) NULL,
        Disponible BIT NOT NULL DEFAULT 1,
        Activo BIT NOT NULL DEFAULT 1,
        FechaAlta DATETIME NOT NULL DEFAULT GETDATE(),
        FechaModificacion DATETIME NULL
    );
END;
`;

export const setupWebMachinesController = async (request, response) => {
  if (process.env.ALLOW_DB_SETUP !== 'true') {
    response.status(403).json({
      status: 'error',
      message: 'Setup de base de datos no habilitado.'
    });
    return;
  }

  try {
    const pool = await getSqlPool();

    await pool.request().query(webMachinesSetupQuery);

    response.json({
      status: 'ok',
      message: 'Tabla dbo.WebMaquinarias verificada o creada correctamente.'
    });
  } catch (error) {
    const diagnosticError = error?.cause || error;

    console.error('[setup-web-maquinarias] SQL Server query error', {
      message: diagnosticError?.message,
      code: diagnosticError?.code,
      originalErrorMessage: diagnosticError?.originalError?.message,
      originalErrorCode: diagnosticError?.originalError?.code
    });

    response.status(500).json({
      status: 'error',
      message: 'No se pudo ejecutar el setup de dbo.WebMaquinarias.'
    });
  }
};
