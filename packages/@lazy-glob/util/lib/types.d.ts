import { GlobbyOptions } from 'globby';
import Bluebird from 'bluebird';
import { IReturnRow } from 'node-novel-globby';
import { SymGlobTree } from '../index';
export declare type ITreeEntries = string | ITreeRow | null;
export declare type ITreeRow = {
    [key: string]: ITreeEntries;
    [SymGlobTree]?: any;
};
export declare type ITree = {
    [key: string]: string | ITreeRow | null;
    [SymGlobTree]?: any;
};
export declare type IOptionsNovelGlobby = GlobbyOptions & {
    cwd?: string;
    absolute?: boolean;
    useDefaultPatternsExclude?: boolean;
    disableAutoHandle?: boolean;
    disableSort?: boolean;
    libPromise?: Bluebird<unknown>;
    onListRow?<T>(a: T, row: IReturnRow, options: IOptionsNovelGlobby): IReturnRow;
    throwEmpty?: boolean;
    sortCallback?(a: any, b: any): number;
    sortFn?<T>(arr: T): T;
    padNum?: number;
    checkRoman?: boolean;
};
