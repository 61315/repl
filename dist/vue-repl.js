import './vue-repl.css'
import { defineComponent, inject, ref, computed, useTemplateRef, createElementBlock, openBlock, createElementVNode, Fragment, renderList, createCommentVNode, unref, normalizeClass, toDisplayString, withModifiers, withDirectives, withKeys, vModelText, mergeModels, useModel, watch, createVNode, createBlock, isRef, provide, toRefs } from 'vue';
import { u as useStore } from './chunks/store-BQHVGsK_.js';
export { F as File } from './chunks/store-BQHVGsK_.js';
import { i as injectKeyProps, d as debounce, _ as _sfc_main$4 } from './chunks/CodeMirrorEditor.vue_vue_type_script_setup_true_lang-CII_ydpq.js';

const _hoisted_1$1 = ["onClick", "onDblclick"];
const _hoisted_2$1 = { class: "label" };
const _hoisted_3 = ["onClick"];
const _hoisted_4 = { class: "file pending" };
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "FileSelector",
  setup(__props) {
    const { store } = inject(injectKeyProps);
    const pending = ref(false);
    const pendingFilename = ref("file.txt");
    function stripPrefix(filename) {
      const parts = filename.split("/");
      return parts[parts.length - 1];
    }
    const files = computed(
      () => Object.entries(store.value.files).filter(([_, file]) => !file.hidden).map(([name]) => name)
    );
    function startAddFile() {
      let i = 0;
      let name = `file.txt`;
      while (true) {
        let hasConflict = false;
        for (const filename in store.value.files) {
          if (stripPrefix(filename) === name) {
            hasConflict = true;
            name = `file${++i}.txt`;
            break;
          }
        }
        if (!hasConflict) {
          break;
        }
      }
      pendingFilename.value = name;
      pending.value = true;
    }
    function cancelNameFile() {
      pending.value = false;
    }
    function focus({ el }) {
      el.focus();
    }
    function doneNameFile() {
      if (!pending.value) return;
      if (!pendingFilename.value) {
        pending.value = false;
        return;
      }
      const filename = pendingFilename.value;
      const oldFilename = pending.value === true ? "" : pending.value;
      if (filename !== oldFilename && filename in store.value.files) {
        alert(`File "${filename}" already exists.`);
        return;
      }
      cancelNameFile();
      if (filename === oldFilename) {
        return;
      }
      if (oldFilename) {
        store.value.renameFile(oldFilename, filename);
      } else {
        store.value.addFile(filename);
      }
    }
    function editFileName(file) {
      pendingFilename.value = stripPrefix(file);
      pending.value = file;
    }
    const fileSelector = useTemplateRef("fileSelector");
    function horizontalScroll(e) {
      e.preventDefault();
      const el = fileSelector.value;
      const direction = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const distance = 30 * (direction > 0 ? 1 : -1);
      el.scrollTo({
        left: el.scrollLeft + distance
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "fileSelector",
        ref: fileSelector,
        class: "file-selector",
        onWheel: horizontalScroll
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(files.value, (file, i) => {
          return openBlock(), createElementBlock(Fragment, { key: file }, [
            pending.value !== file ? (openBlock(), createElementBlock("div", {
              key: 0,
              class: normalizeClass(["file", { active: unref(store).activeFile.filename === file }]),
              onClick: ($event) => unref(store).setActive(file),
              onDblclick: ($event) => editFileName(file)
            }, [
              createElementVNode("span", _hoisted_2$1, toDisplayString(stripPrefix(file)), 1),
              createElementVNode("span", {
                class: "remove",
                onClick: withModifiers(($event) => unref(store).deleteFile(file), ["stop"])
              }, _cache[1] || (_cache[1] = [
                createElementVNode("svg", {
                  class: "icon",
                  width: "12",
                  height: "12",
                  viewBox: "0 0 24 24"
                }, [
                  createElementVNode("line", {
                    stroke: "#999",
                    x1: "18",
                    y1: "6",
                    x2: "6",
                    y2: "18"
                  }),
                  createElementVNode("line", {
                    stroke: "#999",
                    x1: "6",
                    y1: "6",
                    x2: "18",
                    y2: "18"
                  })
                ], -1)
              ]), 8, _hoisted_3)
            ], 42, _hoisted_1$1)) : createCommentVNode("", true),
            pending.value === true && i === files.value.length - 1 || pending.value === file ? (openBlock(), createElementBlock("div", {
              key: 1,
              class: normalizeClass(["file pending", { active: pending.value === file }])
            }, [
              createElementVNode("span", _hoisted_4, toDisplayString(pendingFilename.value), 1),
              withDirectives(createElementVNode("input", {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => pendingFilename.value = $event),
                spellcheck: "false",
                onBlur: doneNameFile,
                onKeyup: [
                  withKeys(doneNameFile, ["enter"]),
                  withKeys(cancelNameFile, ["esc"])
                ],
                onVnodeMounted: focus
              }, null, 544), [
                [vModelText, pendingFilename.value]
              ])
            ], 2)) : createCommentVNode("", true)
          ], 64);
        }), 128)),
        createElementVNode("button", {
          class: "add",
          onClick: startAddFile
        }, "+")
      ], 544);
    };
  }
});

const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const FileSelector = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-7edf93fc"]]);

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ToggleButton",
  props: /* @__PURE__ */ mergeModels({
    text: {}
  }, {
    "modelValue": { type: Boolean },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const active = useModel(__props, "modelValue");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "wrapper",
        onClick: _cache[0] || (_cache[0] = ($event) => active.value = !active.value)
      }, [
        createElementVNode("span", null, toDisplayString(_ctx.text), 1),
        createElementVNode("div", {
          class: normalizeClass(["toggle", [{ active: __props.modelValue }]])
        }, _cache[1] || (_cache[1] = [
          createElementVNode("div", { class: "indicator" }, null, -1)
        ]), 2)
      ]);
    };
  }
});

const ToggleButton = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-13d497a5"]]);

const _hoisted_1 = { class: "editor-container" };
const _hoisted_2 = { class: "editor-floating" };
const SHOW_ERROR_KEY = "repl_show_error";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "EditorContainer",
  props: {
    editorComponent: {}
  },
  setup(__props) {
    const props = __props;
    const { store, autoSave, editorOptions } = inject(injectKeyProps);
    const showMessage = ref(getItem());
    const onChange = debounce((code) => {
      store.value.activeFile.code = code;
    }, 250);
    function setItem() {
      localStorage.setItem(SHOW_ERROR_KEY, showMessage.value ? "true" : "false");
    }
    function getItem() {
      const item = localStorage.getItem(SHOW_ERROR_KEY);
      return !(item === "false");
    }
    watch(showMessage, () => {
      setItem();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(FileSelector),
        createElementVNode("div", _hoisted_1, [
          createVNode(props.editorComponent, {
            value: unref(store).activeFile.code,
            filename: unref(store).activeFile.filename,
            onChange: unref(onChange)
          }, null, 8, ["value", "filename", "onChange"]),
          createElementVNode("div", _hoisted_2, [
            unref(editorOptions)?.autoSaveText !== false ? (openBlock(), createBlock(ToggleButton, {
              key: 0,
              modelValue: unref(autoSave),
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(autoSave) ? autoSave.value = $event : null),
              text: unref(editorOptions)?.autoSaveText || "Auto Save"
            }, null, 8, ["modelValue", "text"])) : createCommentVNode("", true)
          ])
        ])
      ], 64);
    };
  }
});

const EditorContainer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-db01c992"]]);

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Repl",
  props: /* @__PURE__ */ mergeModels({
    theme: { default: "light" },
    store: { default: () => useStore() },
    autoResize: { type: Boolean, default: true },
    initialValue: { default: "" },
    filename: { default: "text.txt" },
    editorOptions: { default: () => ({}) }
  }, {
    "modelValue": { type: Boolean, ...{ default: true } },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    const autoSave = useModel(__props, "modelValue");
    const props = __props;
    if (props.initialValue && props.filename) {
      if (!props.store.files[props.filename]) {
        props.store.files[props.filename] = {
          filename: props.filename,
          code: props.initialValue
        };
      }
      props.store.activeFilename = props.filename;
    }
    props.store.init();
    provide(injectKeyProps, {
      ...toRefs(props),
      autoSave
    });
    const getValue = () => props.store.activeFile.code;
    const setValue = (code) => {
      props.store.activeFile.code = code;
    };
    __expose({ getValue, setValue });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["vue-repl", { dark: _ctx.theme === "dark" }])
      }, [
        createVNode(EditorContainer, { "editor-component": _sfc_main$4 })
      ], 2);
    };
  }
});

export { _sfc_main as Repl, useStore };
