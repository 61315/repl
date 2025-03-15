<script setup lang="ts">
import { type Store, useStore } from './store'
import { provide, toRefs } from 'vue'
import { injectKeyProps } from './types'
import EditorContainer from './editor/EditorContainer.vue'

export interface Props {
  theme?: 'dark' | 'light'
  editor: any // Will only accept CodeMirror editor
  store?: Store
  autoResize?: boolean
  initialValue?: string
  filename?: string
  editorOptions?: {
    autoSaveText?: string | false
  }
}

const autoSave = defineModel<boolean>({ default: true })

const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
  store: () => useStore(),
  autoResize: true,
  initialValue: '',
  filename: 'text.txt',
  editorOptions: () => ({}),
})

// Check if CodeMirror is being used
if (props.editor.editorType !== 'codemirror') {
  throw new Error('This component only supports CodeMirror editor')
}

// Initialize store with a simple text file
if (props.initialValue && props.filename) {
  if (!props.store.files[props.filename]) {
    props.store.files[props.filename] = {
      filename: props.filename,
      code: props.initialValue,
    }
  }
  props.store.activeFilename = props.filename
}

props.store.init()

provide(injectKeyProps, {
  ...toRefs(props),
  autoSave,
})

// Expose method to get current content
const getValue = () => props.store.activeFile.code
const setValue = (code: string) => {
  props.store.activeFile.code = code
}

defineExpose({ getValue, setValue })
</script>

<template>
  <div class="vue-repl" :class="{ dark: theme === 'dark' }">
    <EditorContainer :editor-component="editor" />
  </div>
</template>

<style>
.vue-repl {
  --bg: #fff;
  --bg-soft: #f8f8f8;
  --border: #ddd;
  --text-light: #888;
  --font-code: Menlo, Monaco, Consolas, 'Courier New', monospace;
  --color-branding: #42b883;
  --color-branding-dark: #416f9c;
  --header-height: 38px;

  height: 100%;
  margin: 0;
  overflow: hidden;
  font-size: 13px;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--bg-soft);
}

.dark .vue-repl {
  --bg: #1a1a1a;
  --bg-soft: #242424;
  --border: #383838;
  --text-light: #aaa;
  --color-branding: #42d392;
  --color-branding-dark: #89ddff;
}

.vue-repl button {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}
</style>
