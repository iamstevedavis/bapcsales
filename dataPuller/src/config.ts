export default {
  db: {
    host: process.env.DB_HOST || 'ds217351.mlab.com',
    password: process.env.DB_PASSWORD || 'Password1!',
    port: process.env.DB_PORT || '17351',
    scope: process.env.DB_SCOPE || 'bapcsales',
    username: process.env.DB_USERNAME || 'readwrite',
  },
  reddit: {
    clientId: process.env.REDDIT_APP_CLIENT_ID || '',
    clientSecret: process.env.REDDIT_APP_CLIENT_SECRET || '',
    password: process.env.REDDIT_ACCOUNT_PASSWORD || '',
    refreshToken: '',
    userAgent: process.env.REDDIT_USER_AGENT || '',
    username: process.env.REDDIT_ACCOUNT_USERNAME || '',
  },
};
