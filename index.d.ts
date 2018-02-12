/// <reference types="glob" />
import * as Promise from 'bluebird';
import * as globby from 'globby';
import { IOptions as IGlobOptions } from 'glob';
export { globby };
export interface IOptions extends IGlobOptions {
    cwd?: string;
    absolute?: boolean;
    useDefaultPatternsExclude?: boolean;
    disableAutoHandle?: boolean;
    disableSort?: boolean;
    libPromise?: Promise;
    onListRow?: (a: IReturnList2, row: IReturnRow, options: IOptions) => IReturnRow;
    throwEmpty?: boolean;
    sortCallback?(a: any, b: any): number;
    sortFn?<T>(arr: T): T;
}
export declare const defaultPatternsExclude: string[];
export declare const defaultPatterns: string[];
export declare const defaultOptions: IOptions;
export interface IReturnOptionsArray {
    0: string[];
    1: IOptions;
}
export interface IReturnOptionsObject {
    patterns: string[];
    options: IOptions;
}
export interface IReturnOptions extends IReturnOptionsArray, IReturnOptionsObject {
    [Symbol.iterator](): any;
}
export interface IReturnRow {
    source_idx: number;
    source_path: string;
    path: string;
    path_dir: string;
    dir: string;
    file: string;
    ext: string;
    volume_title: string;
    chapter_title: string;
    val_file: string;
    val_dir: string;
}
export interface IReturnList {
    [key: string]: IReturnRow[];
}
export interface IReturnList2 {
    [key: string]: {
        [key: string]: IReturnRow;
    };
}
export declare function getOptions(options: IOptions): IReturnOptions;
export declare function getOptions(patterns?: string[], options?: IOptions): IReturnOptions;
export declare function globbySync(options: IOptions): IReturnList;
export declare function globbySync(patterns?: string[], options?: IOptions): IReturnList;
export declare function globbyASync(options: IOptions): Promise<IReturnList>;
export declare function globbyASync(patterns?: string[], options?: IOptions): Promise<IReturnList>;
export declare function globToList(glob_ls: string[], options?: IOptions): IReturnList;
export interface IReturnGlobListOptions {
    useSourcePath?: boolean;
}
export declare function returnGlobList(ls: IReturnList, options?: IReturnGlobListOptions): string[];
export declare function glob_to_list(glob_ls: string[], options?: IOptions): IReturnList2;
export declare function normalize_val(str: string, padNum?: number): string;
export declare function _p_sort_list1(ls: IReturnList2, options?: IOptions): {};
export declare function _p_sort_list2(ls: any, options?: IOptions): IReturnList;
export declare function p_sort_list(ls: IReturnList2, options?: IOptions): IReturnList;
import * as self from './index';
export default self;
