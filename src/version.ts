/** Injected in `vite.config.ts` from package.json + per-build timestamp. */
export const APP_VERSION = __APP_VERSION__;
export const APP_NAME = __APP_NAME__;
/** Use for `?v=` on public URLs or logs — changes every build so browsers skip stale cached files. */
export const APP_BUILD_ID = __APP_BUILD_ID__;
