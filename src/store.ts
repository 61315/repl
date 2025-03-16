import { type ToRefs, type UnwrapRef, computed, reactive, ref } from 'vue'

export class File {
  editorViewState: any = null

  constructor(
    public filename: string,
    public code = '',
    public hidden = false,
  ) {}

  get language() {
    const ext = this.filename.split('.').pop() || ''
    switch (ext) {
      case 'html':
        return 'html'
      case 'css':
        return 'css'
      case 'ts':
        return 'typescript'
      case 'js':
        return 'javascript'
      case 'json':
        return 'json'
      case 'md':
        return 'markdown'
      case 'glsl':
      case 'fs':
      case 'vs':
      case 'frag':
      case 'vert':
        return 'clike'
      case 'txt':
      default:
        return 'text'
    }
  }
}

export function useStore(
  { files = ref(Object.create(null)), activeFilename = ref('text.txt') } = {},
  serializedState?: string,
) {
  // Initialize with a default file if no files exist
  function setDefaultFile(): void {
    setFile(files.value, activeFilename.value, '')
  }

  // Simple file operations
  const setActive = (filename: string) => {
    activeFilename.value = filename
  }

  const addFile = (fileOrFilename: string | File) => {
    let file: File
    if (typeof fileOrFilename === 'string') {
      file = new File(fileOrFilename, '')
    } else {
      file = fileOrFilename
    }
    files.value[file.filename] = file
    if (!file.hidden) setActive(file.filename)
  }

  const deleteFile = (filename: string) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) {
      return
    }

    if (activeFilename.value === filename) {
      const fileNames = Object.keys(files.value)
      const index = fileNames.indexOf(filename)
      const newActive = fileNames[index === 0 ? 1 : index - 1] || 'text.txt'
      activeFilename.value = newActive
    }
    delete files.value[filename]
  }

  const renameFile = (oldFilename: string, newFilename: string) => {
    const file = files.value[oldFilename]
    if (!file || !newFilename || oldFilename === newFilename) {
      return
    }

    file.filename = newFilename
    const newFiles: Record<string, File> = {}

    // Preserve iteration order for files
    for (const [name, f] of Object.entries(files.value)) {
      if (name === oldFilename) {
        newFiles[newFilename] = f
      } else {
        newFiles[name] = f
      }
    }

    files.value = newFiles
    if (activeFilename.value === oldFilename) {
      activeFilename.value = newFilename
    }
  }

  // Serialization for URL sharing or state persistence
  const serialize = () => {
    const exportedFiles: Record<string, string> = {}
    for (const [filename, file] of Object.entries(files.value)) {
      exportedFiles[filename] = file.code
    }
    return '#' + btoa(encodeURIComponent(JSON.stringify(exportedFiles)))
  }

  const deserialize = (hash: string) => {
    if (hash.startsWith('#')) hash = hash.slice(1)
    let saved: Record<string, string>
    try {
      saved = JSON.parse(decodeURIComponent(atob(hash)))
    } catch (e) {
      console.error('Failed to load from hash', e)
      setDefaultFile()
      return
    }

    // Clear existing files
    files.value = Object.create(null)

    // Set files from saved state
    for (const [filename, content] of Object.entries(saved)) {
      setFile(files.value, filename, content)
    }

    // Set active file
    if (Object.keys(files.value).length) {
      activeFilename.value = Object.keys(files.value)[0]
    } else {
      setDefaultFile()
    }
  }

  // Set file content
  function setFile(
    files: Record<string, File>,
    filename: string,
    content: string,
  ) {
    files[filename] = new File(filename, content)
  }

  // Initialize store
  // if (serializedState) {
  //   deserialize(serializedState)
  // } else if (Object.keys(files.value).length === 0) {
  setDefaultFile()
  // }

  const activeFile = computed(() => files.value[activeFilename.value])

  // Initialize the store
  const init = () => {
    // Nothing complex to initialize anymore
  }

  const store = reactive({
    files,
    activeFile,
    activeFilename,
    init,
    setActive,
    addFile,
    deleteFile,
    renameFile,
    serialize,
    deserialize,
  })

  return store
}

export type Store = ReturnType<typeof useStore>
