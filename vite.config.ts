import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function readPackageJson(): { name: string; version: string } {
  const raw = readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
  return JSON.parse(raw) as { name: string; version: string }
}

// https://vite.dev/config/
export default defineConfig(() => {
  const pkg = readPackageJson()
  /** New on every config load (each dev start / production build) — busts cache for public/* links */
  const buildId = `${pkg.version}-${Date.now()}`

  return {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __APP_NAME__: JSON.stringify(pkg.name),
      __APP_BUILD_ID__: JSON.stringify(buildId),
    },
    plugins: [
      react(),
      {
        name: 'rich-crowd-html-build-meta',
        transformIndexHtml(html) {
          const v = encodeURIComponent(buildId)
          let out = html.replace(
            /<link rel="manifest" href="\/manifest.json"\s*\/>/,
            `<link rel="manifest" href="/manifest.json?v=${v}" />`,
          )
          out = out.replace(
            /<meta charset="UTF-8" \/>/,
            `<meta charset="UTF-8" />
  <meta name="app-version" content="${escapeAttr(pkg.version)}" />
  <meta name="build-id" content="${escapeAttr(buildId)}" />`,
          )
          return out
        },
      },
    ],
    resolve: {
      alias: {
        src: fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // Bundled CSS/JS already get content hashes in production (cache bust when files change).
  }
})

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}
