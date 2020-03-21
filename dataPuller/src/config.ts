export default {
  db: {
    username: process.env.DB_USERNAME || "readwrite",
    password: process.env.DB_PASSWORD || "Password1!",
    host: process.env.DB_HOST || "ds217351.mlab.com",
    port: process.env.DB_PORT || "17351",
    scope: process.env.DB_SCOPE || "bapcsales"
  },
  reddit: {
    clientId: process.env.REDDIT_APP_CLIENT_ID || "",
    clientSecret: process.env.REDDIT_APP_CLIENT_SECRET || "",
    password: process.env.REDDIT_ACCOUNT_PASSWORD || "",
    userAgent: process.env.REDDIT_USER_AGENT || "",
    username: process.env.REDDIT_ACCOUNT_USERNAME || "",
    refreshToken: ""
  }
};