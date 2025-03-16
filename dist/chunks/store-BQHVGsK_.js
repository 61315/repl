import { computed, ref, reactive } from 'vue';

class File {
  constructor(filename, code = "", hidden = false) {
    this.filename = filename;
    this.code = code;
    this.hidden = hidden;
    this.editorViewState = null;
  }
  get language() {
    const ext = this.filename.split(".").pop() || "";
    switch (ext) {
      case "html":
        return "html";
      case "css":
        return "css";
      case "ts":
        return "typescript";
      case "js":
        return "javascript";
      case "json":
        return "json";
      case "md":
        return "markdown";
      case "glsl":
      case "fs":
      case "vs":
      case "frag":
      case "vert":
        return "clike";
      case "txt":
      default:
        return "text";
    }
  }
}
function useStore({ files = ref(/* @__PURE__ */ Object.create(null)), activeFilename = ref("text.txt") } = {}, serializedState) {
  function setDefaultFile() {
    setFile(files.value, activeFilename.value, "");
  }
  const setActive = (filename) => {
    activeFilename.value = filename;
  };
  const addFile = (fileOrFilename) => {
    let file;
    if (typeof fileOrFilename === "string") {
      file = new File(fileOrFilename, "");
    } else {
      file = fileOrFilename;
    }
    files.value[file.filename] = file;
    if (!file.hidden) setActive(file.filename);
  };
  const deleteFile = (filename) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) {
      return;
    }
    if (activeFilename.value === filename) {
      const fileNames = Object.keys(files.value);
      const index = fileNames.indexOf(filename);
      const newActive = fileNames[index === 0 ? 1 : index - 1] || "text.txt";
      activeFilename.value = newActive;
    }
    delete files.value[filename];
  };
  const renameFile = (oldFilename, newFilename) => {
    const file = files.value[oldFilename];
    if (!file || !newFilename || oldFilename === newFilename) {
      return;
    }
    file.filename = newFilename;
    const newFiles = {};
    for (const [name, f] of Object.entries(files.value)) {
      if (name === oldFilename) {
        newFiles[newFilename] = f;
      } else {
        newFiles[name] = f;
      }
    }
    files.value = newFiles;
    if (activeFilename.value === oldFilename) {
      activeFilename.value = newFilename;
    }
  };
  const serialize = () => {
    const exportedFiles = {};
    for (const [filename, file] of Object.entries(files.value)) {
      exportedFiles[filename] = file.code;
    }
    return "#" + btoa(encodeURIComponent(JSON.stringify(exportedFiles)));
  };
  const deserialize = (hash) => {
    if (hash.startsWith("#")) hash = hash.slice(1);
    let saved;
    try {
      saved = JSON.parse(decodeURIComponent(atob(hash)));
    } catch (e) {
      console.error("Failed to load from hash", e);
      setDefaultFile();
      return;
    }
    files.value = /* @__PURE__ */ Object.create(null);
    for (const [filename, content] of Object.entries(saved)) {
      setFile(files.value, filename, content);
    }
    if (Object.keys(files.value).length) {
      activeFilename.value = Object.keys(files.value)[0];
    } else {
      setDefaultFile();
    }
  };
  function setFile(files2, filename, content) {
    files2[filename] = new File(filename, content);
  }
  setDefaultFile();
  const activeFile = computed(() => files.value[activeFilename.value]);
  const init = () => {
  };
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
    deserialize
  });
  return store;
}

export { File as F, useStore as u };
