import { type Plugin, mergeConfig } from 'vite'
import dts from 'vite-plugin-dts'
import base from './vite.preview.config'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Patch generated entries and import their corresponding CSS files.
 */
const patchCssFiles: Plugin = {
  name: 'patch-css',
  apply: 'build',
  writeBundle() {
    //  inject css imports to the files
    const outDir = path.resolve('dist')
    ;['vue-repl', 'codemirror-editor'].forEach((file) => {
      const filePath = path.resolve(outDir, file + '.js')
      const content = fs.readFileSync(filePath, 'utf-8')
      fs.writeFileSync(filePath, `import './${file}.css'\n${content}`)
    })
  },
}

export default mergeConfig(base, {
  plugins: [
    dts({
      rollupTypes: true,
    }),
    patchCssFiles,
  ],
  optimizeDeps: {
    // avoid late discovered deps
    include: [],
  },
  base: './',
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: {
        'vue-repl': './src/index.ts',
        core: './src/core.ts',
        'codemirror-editor': './src/editor/CodeMirrorEditor.vue',
      },
      formats: ['es'],
      fileName: () => '[name].js',
    },
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
      external: ['vue'],
    },
  },
})
