import { ITree, ITreeRow } from './core';
declare const self: ((data: string[]) => ITree) & {
    globToTree: (data: string[]) => ITree;
    treeToGlob: (a: ITree, d?: string[]) => string[];
    ITree: ITree;
    ITreeRow: ITreeRow;
    default: (data: string[]) => ITree;
};
export = self;
