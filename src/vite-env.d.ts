/// <reference types="vite/client" />

/** From package.json `version` */
declare const __APP_VERSION__: string;
/** From package.json `name` */
declare const __APP_NAME__: string;
/** `${version}-${buildTimestamp}` — new on every `vite build` / dev start for cache bust */
declare const __APP_BUILD_ID__: string;
