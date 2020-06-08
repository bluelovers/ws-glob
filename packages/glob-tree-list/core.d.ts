/**
 * Created by user on 2018/3/29/029.
 */
export * from '@lazy-glob/util/lib/types';
import path from 'upath2';
import { ITree } from '@lazy-glob/util/lib/types';
export { path };
export declare function globToTree(data: string[]): ITree;
export declare namespace globToTree {
    var globToTree: typeof import("./core").globToTree;
    var treeToGlob: typeof import("./core").treeToGlob;
    var default: typeof import("./core").globToTree;
}
export declare function treeToGlob(a: ITree, d?: string[]): string[];
declare const _default: typeof import("./core");
export default _default;
