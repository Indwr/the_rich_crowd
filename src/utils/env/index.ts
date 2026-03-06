/// <reference types="node" />

const viteEnv = import.meta.env;
const processEnv = typeof process !== 'undefined' ? process.env : undefined;

export const env = Object.freeze({
  API_URL: viteEnv.VITE_API_URL ?? processEnv?.API_URL ?? '/v1/',
  APP_MODE: viteEnv.VITE_APP_MODE ?? processEnv?.APP_MODE ?? 'development',
  NODE_ENV: viteEnv.MODE ?? viteEnv.VITE_NODE_ENV ?? processEnv?.NODE_ENV ?? 'development',
  PORT: viteEnv.VITE_PORT ?? processEnv?.PORT ?? '3000',
  SITE_URL: viteEnv.VITE_SITE_URL ?? processEnv?.SITE_URL ?? 'https://therichcrowd.live/',
} as const);