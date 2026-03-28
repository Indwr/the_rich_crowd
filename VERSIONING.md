# App version & cache

- **`package.json` → `version`** is the semantic version (bump for releases).
- Every **`vite build`** / dev server start generates a new **`build-id`** = `version` + timestamp, injected as:
  - `<meta name="build-id">` in `index.html`
  - `?v=...` on `/manifest.json` so the PWA manifest is not stuck in cache.
- **Imported CSS** (`import '...css'`) is emitted as hashed files like `assets/index-[hash].css` — when styles change, the hash changes and browsers load the new file.

For production, configure your CDN / nginx so **`index.html` is not cached for a long time** (or use short `max-age`), so clients always get the latest HTML that points to the new hashed assets.

Use in React:

```ts
import { APP_VERSION, APP_BUILD_ID } from 'src/version';
```
