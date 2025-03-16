import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { DefineComponent } from 'vue';
import { PublicProps } from 'vue';
import { Ref } from 'vue';

declare type __VLS_Props = ReplProps;

declare type __VLS_PublicProps = {
    modelValue?: boolean;
} & __VLS_Props;

declare class File_2 {
    filename: string;
    code: string;
    hidden: boolean;
    editorViewState: any;
    constructor(filename: string, code?: string, hidden?: boolean);
    get language(): "html" | "css" | "typescript" | "javascript" | "json" | "markdown" | "clike" | "text";
}
export { File_2 as File }

export declare const Repl: DefineComponent<__VLS_PublicProps, {
getValue: () => any;
setValue: (code: string) => void;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
"update:modelValue": (value: boolean) => any;
}, string, PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
"onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, {
filename: string;
store: Store;
theme: "dark" | "light";
autoResize: boolean;
initialValue: string;
editorOptions: {
autoSaveText?: string | false;
};
}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

export declare interface ReplProps {
    theme?: 'dark' | 'light';
    store?: Store;
    autoResize?: boolean;
    initialValue?: string;
    filename?: string;
    editorOptions?: {
        autoSaveText?: string | false;
    };
}

export declare type Store = ReturnType<typeof useStore>;

export declare function useStore({ files, activeFilename }?: {
    files?: Ref<any, any> | undefined;
    activeFilename?: Ref<string, string> | undefined;
}, serializedState?: string): {
    files: any;
    activeFile: any;
    activeFilename: string;
    init: () => void;
    setActive: (filename: string) => void;
    addFile: (fileOrFilename: string | File_2) => void;
    deleteFile: (filename: string) => void;
    renameFile: (oldFilename: string, newFilename: string) => void;
    serialize: () => string;
    deserialize: (hash: string) => void;
};

export { }
