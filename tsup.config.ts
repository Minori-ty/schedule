import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    bundle: true,
    outDir: 'dist',
    format: ['cjs'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: true,
    external: [],
})
