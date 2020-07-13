export const db = {
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT || '',
  scope: process.env.DB_SCOPE || '',
};

export const api = {
  port: process.env.API_PORT || '3030',
};

export const reddit = {
  clientId: process.env.REDDIT_APP_CLIENT_ID || '',
  clientSecret: process.env.REDDIT_APP_CLIENT_SECRET || '',
  password: process.env.REDDIT_ACCOUNT_PASSWORD || '',
  refreshToken: '',
  userAgent: process.env.REDDIT_USER_AGENT || '',
  username: process.env.REDDIT_ACCOUNT_USERNAME || '',
};
