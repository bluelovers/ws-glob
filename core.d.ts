import path from 'upath2';
export { path };
export declare function globToTree(data: string[]): ITree;
export declare function treeToGlob(a: ITree, d?: string[]): string[];
export declare type ITreeEntries = string | ITreeRow | null;
export declare type ITreeRow = {
    [key: string]: ITreeEntries;
};
export declare type ITree = {
    [key: string]: string | ITreeRow | null;
};
import * as self from './core';
export default self;
