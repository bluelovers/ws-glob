/**
 * Created by user on 2018/3/29/029.
 */
import path from 'upath2';
export { path };
export declare function globToTree(data: string[]): ITree;
export declare namespace globToTree {
    var globToTree: typeof import("./core").globToTree;
    var treeToGlob: typeof import("./core").treeToGlob;
    var default: typeof import("./core").globToTree;
}
export declare function treeToGlob(a: ITree, d?: string[]): string[];
export declare module globToTree {
    type ITreeEntries = string | ITreeRow | null;
    type ITreeRow = {
        [key: string]: ITreeEntries;
    };
    type ITree = {
        [key: string]: string | ITreeRow | null;
    };
}
export import ITreeEntries = globToTree.ITreeEntries;
export import ITreeRow = globToTree.ITreeRow;
export import ITree = globToTree.ITree;
declare const _default: typeof import("./core");
export default _default;
