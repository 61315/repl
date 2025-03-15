<script setup lang="ts">
import { injectKeyProps } from '../../src/types'
import { type VNode, computed, inject, ref, useTemplateRef } from 'vue'

const { store } = inject(injectKeyProps)!

/**
 * When `true`: indicates adding a new file
 * When `string`: indicates renaming a file, and holds the old filename in case
 * of cancel.
 */
const pending = ref<boolean | string>(false)
/**
 * Text shown in the input box when editing a file's name
 */
const pendingFilename = ref('file.txt')

// Helper function to strip any path prefix from filename
function stripPrefix(filename: string): string {
  const parts = filename.split('/')
  return parts[parts.length - 1]
}

const files = computed(() =>
  Object.entries(store.value.files)
    .filter(([_, file]) => !file.hidden)
    .map(([name]) => name),
)

function startAddFile() {
  let i = 0
  let name = `file.txt`

  while (true) {
    let hasConflict = false
    for (const filename in store.value.files) {
      if (stripPrefix(filename) === name) {
        hasConflict = true
        name = `file${++i}.txt`
        break
      }
    }
    if (!hasConflict) {
      break
    }
  }

  pendingFilename.value = name
  pending.value = true
}

function cancelNameFile() {
  pending.value = false
}

function focus({ el }: VNode) {
  ;(el as HTMLInputElement).focus()
}

function doneNameFile() {
  if (!pending.value) return
  if (!pendingFilename.value) {
    pending.value = false
    return
  }

  const filename = pendingFilename.value
  const oldFilename = pending.value === true ? '' : pending.value

  // Accept common text file extensions
  // if (!/\.(txt|md|html|css|js|jsx|ts|tsx|json|xml|csv|yaml|yml|ini|log|sh|bat|py|rb|java|c|cpp|h|hpp|glsl|fs|vs|frag|vert)$/.test(filename)) {
  //   alert("Please provide a valid file extension")
  //   return
  // }

  if (filename !== oldFilename && filename in store.value.files) {
    alert(`File "${filename}" already exists.`)
    return
  }

  cancelNameFile()

  if (filename === oldFilename) {
    return
  }

  if (oldFilename) {
    store.value.renameFile(oldFilename, filename)
  } else {
    store.value.addFile(filename)
  }
}

function editFileName(file: string) {
  pendingFilename.value = stripPrefix(file)
  pending.value = file
}

const fileSelector = useTemplateRef('fileSelector')
function horizontalScroll(e: WheelEvent) {
  e.preventDefault()
  const el = fileSelector.value!
  const direction =
    Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY
  const distance = 30 * (direction > 0 ? 1 : -1)
  el.scrollTo({
    left: el.scrollLeft + distance,
  })
}
</script>

<template>
  <div ref="fileSelector" class="file-selector" @wheel="horizontalScroll">
    <template v-for="(file, i) in files" :key="file">
      <div
        v-if="pending !== file"
        class="file"
        :class="{ active: store.activeFile.filename === file }"
        @click="store.setActive(file)"
        @dblclick="editFileName(file)"
      >
        <span class="label">{{ stripPrefix(file) }}</span>
        <span class="remove" @click.stop="store.deleteFile(file)">
          <svg class="icon" width="12" height="12" viewBox="0 0 24 24">
            <line stroke="#999" x1="18" y1="6" x2="6" y2="18" />
            <line stroke="#999" x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
      </div>
      <div
        v-if="(pending === true && i === files.length - 1) || pending === file"
        class="file pending"
        :class="{ active: pending === file }"
      >
        <span class="file pending">{{ pendingFilename }}</span>
        <input
          v-model="pendingFilename"
          spellcheck="false"
          @blur="doneNameFile"
          @keyup.enter="doneNameFile"
          @keyup.esc="cancelNameFile"
          @vue:mounted="focus"
        />
      </div>
    </template>
    <button class="add" @click="startAddFile">+</button>
  </div>
</template>

<style scoped>
.file-selector {
  display: flex;
  box-sizing: border-box;
  border-bottom: 1px solid var(--border);
  background-color: var(--bg);
  overflow-y: hidden;
  overflow-x: auto;
  white-space: nowrap;
  position: relative;
  height: var(--header-height);
}

.file-selector::-webkit-scrollbar {
  height: 1px;
}

.file-selector::-webkit-scrollbar-track {
  background-color: var(--border);
}

.file-selector::-webkit-scrollbar-thumb {
  background-color: var(--color-branding);
}

@-moz-document url-prefix() {
  .file-selector {
    scrollbar-width: thin;
    scrollbar-color: var(--color-branding) var(--border);
  }
}

.file {
  position: relative;
  display: inline-block;
  font-size: 13px;
  font-family: var(--font-code);
  cursor: pointer;
  color: var(--text-light);
  box-sizing: border-box;
}

.file.active {
  color: var(--color-branding);
  border-bottom: 3px solid var(--color-branding);
  cursor: text;
}

.file span {
  display: inline-block;
  padding: 8px 10px 6px;
  line-height: 20px;
}

.file.pending span {
  min-width: 50px;
  min-height: 34px;
  padding-right: 32px;
  background-color: rgba(200, 200, 200, 0.2);
  color: transparent;
}

.file.pending input {
  position: absolute;
  inset: 8px 7px auto;
  font-size: 13px;
  font-family: var(--font-code);
  line-height: 20px;
  outline: none;
  border: none;
  padding: 0 3px;
  min-width: 1px;
  color: inherit;
  background-color: transparent;
}

.file .remove {
  display: inline-block;
  vertical-align: middle;
  line-height: 12px;
  cursor: pointer;
  padding-left: 0;
}

.add {
  font-size: 18px;
  font-family: var(--font-code);
  color: #999;
  vertical-align: middle;
  margin-left: 6px;
  position: relative;
  top: -1px;
}

.add:hover {
  color: var(--color-branding);
}

.icon {
  margin-top: -1px;
}
</style>
