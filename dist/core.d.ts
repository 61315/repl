import { Ref } from 'vue';

declare class File_2 {
    filename: string;
    code: string;
    hidden: boolean;
    editorViewState: any;
    constructor(filename: string, code?: string, hidden?: boolean);
    get language(): "html" | "css" | "typescript" | "javascript" | "json" | "markdown" | "clike" | "text";
}
export { File_2 as File }

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
