let sqlPoolPromise;
let mssqlModulePromise;

const parseBoolean = (value, defaultValue) => {
  if (value === undefined || value === '') {
    return defaultValue;
  }

  return ['true', '1', 'yes', 'y'].includes(String(value).trim().toLowerCase());
};

const parsePort = (value) => {
  const port = Number.parseInt(value, 10);
  return Number.isInteger(port) && port > 0 ? port : undefined;
};

const getRequiredEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Falta configurar la variable de entorno ${name} para conectar con SQL Server.`);
  }

  return value;
};

const createSqlConfig = () => {
  const server = getRequiredEnv('DB_SERVER');
  const database = getRequiredEnv('DB_DATABASE');
  const user = getRequiredEnv('DB_USER');
  const password = getRequiredEnv('DB_PASSWORD');
  const instanceName = process.env.DB_INSTANCE?.trim();
  const port = parsePort(process.env.DB_PORT);

  const config = {
    server,
    database,
    user,
    password,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: parseBoolean(process.env.DB_ENCRYPT, false),
      trustServerCertificate: parseBoolean(process.env.DB_TRUST_SERVER_CERTIFICATE, true),
      enableArithAbort: true
    }
  };

  if (instanceName) {
    config.options.instanceName = instanceName;
  } else if (port) {
    config.port = port;
  }

  return config;
};

const getMssqlModule = async () => {
  if (!mssqlModulePromise) {
    mssqlModulePromise = import('mssql').catch((error) => {
      mssqlModulePromise = undefined;
      throw new Error(`No se pudo cargar el paquete mssql: ${error.message}`);
    });
  }

  return mssqlModulePromise;
};

export const getSqlPool = async () => {
  if (!sqlPoolPromise) {
    const config = createSqlConfig();
    const sql = await getMssqlModule();

    sqlPoolPromise = new sql.ConnectionPool(config)
      .connect()
      .catch((error) => {
        sqlPoolPromise = undefined;
        throw new Error(`No se pudo conectar con SQL Server (${config.server}/${config.database}): ${error.message}`);
      });
  }

  return sqlPoolPromise;
};
