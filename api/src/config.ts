export default {
  db: {
    username: process.env.DB_USERNAME || 'readwrite',
    password: process.env.DB_PASSWORD || 'Password1!',
    host: process.env.DB_HOST || 'ds217351.mlab.com',
    port: process.env.DB_PORT || '17351',
    scope: process.env.DB_SCOPE || 'bapcsales',
  },
  api: {
    port: process.env.API_PORT || '3030',
  },
};