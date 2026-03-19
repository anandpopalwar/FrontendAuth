// src/config/env.ts

const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_SERVER_URL!,
  appEnv: process.env.NEXT_PUBLIC_APP_ENV || "development",
};

export default env;
