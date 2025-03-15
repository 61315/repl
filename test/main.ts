/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
import { createApp, h, ref, watchEffect } from 'vue'
import { Repl, useStore } from '../src'
import CodeMirrorEditor from '../src/editor/CodeMirrorEditor.vue'

// Set up global window properties for development/testing
const window = globalThis.window as any
window.process = { env: {} }

const App = {
  setup() {
    // Initialize the store with optional serialized state from URL hash
    const store = useStore({}, location.hash)

    // Log store for debugging purposes
    console.info(store)

    // Update URL hash when store changes for state persistence
    watchEffect(() => history.replaceState({}, '', store.serialize()))

    // Example of adding files programmatically
    // Uncomment to use

    setTimeout(() => {
      store.addFile('readme.md')
      store.addFile('example.txt')
      store.addFile('script.js')
      store.files['readme.md'].code =
        '# Simple Text Editor\n\nThis is a markdown file example.'
      store.files['script.js'].code = 'console.log("Hello world!");'
    }, 1000)

    // Set theme - can be 'light' or 'dark'
    const theme = ref<'light' | 'dark'>('dark')
    window.theme = theme

    // Return render function
    return () =>
      h(Repl, {
        store,
        theme: theme.value,
        editor: CodeMirrorEditor,
        initialValue:
          '# Welcome to the Simple Text Editor\n\nStart typing or add files using the file selector above.',
        filename: 'welcome.md',
        editorOptions: {
          autoSaveText: '💾',
        },
        // Default to auto-save being enabled
        autoSave: true,
      })
  },
}

createApp(App).mount('#app')
