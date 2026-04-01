import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** 本地开发不设环境变量 → ./ ；CI 设 GITHUB_PAGES_BASE=仓库名 或 /仓库名/ → 与 Pages 子路径一致 */
function resolveBase() {
  const raw = process.env.GITHUB_PAGES_BASE?.trim()
  if (!raw) return './'
  let b = raw.startsWith('/') ? raw : `/${raw}`
  if (!b.endsWith('/')) b += '/'
  return b
}

export default defineConfig({
  base: resolveBase(),
  plugins: [react()],
})
