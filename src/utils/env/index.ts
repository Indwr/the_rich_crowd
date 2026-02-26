/// <reference types="node" />

export const env = Object.freeze({
  API_URL: process.env.API_URL,
  APP_MODE: process.env.APP_MODE,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
} as const);