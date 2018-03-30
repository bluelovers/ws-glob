import path from 'upath2';
export { path };
export declare function globToTree(data: string[]): ITree;
export declare function treeToGlob(a: ITree, d?: string[]): string[];
export declare type ITreeRow = {
    [key: string]: string | ITreeRow | null;
};
export declare type ITree = {
    [key: string]: ITreeRow;
};
import * as self from './core';
export default self;
