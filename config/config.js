const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'secret_key',
  mongoUri: process.env.DB_HOST_LOCAL,
};

export default config;
