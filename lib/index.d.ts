/// <reference types="glob" />
import * as Promise from 'bluebird';
import { normalize_val } from './helper';
export { normalize_val };
import { IOptions as IGlobOptions } from 'glob';
export declare const defaultPatternsExclude: string[];
export declare const defaultPatterns: string[];
export declare const defaultOptions: IOptions;
export interface IApi<T> {
    (options: IOptions): T;
    (patterns?: string[], options?: IOptions): T;
}
export declare type IApiSync = IApi<IReturnList>;
export declare type IApiAsync = IApi<Promise<IReturnList>>;
export interface IApiWithReturnGlob<T> {
    (options: IOptionsWithReturnGlobList): T;
    (patterns?: string[], options?: IOptionsWithReturnGlobList): T;
}
export declare type IApiWithReturnGlobSync = IApiWithReturnGlob<IReturnGlob>;
export declare type IApiWithReturnGlobAsync = IApiWithReturnGlob<Promise<IReturnGlob>>;
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
    padNum?: number;
    checkRoman?: boolean;
}
export declare type IOptionsWithReturnGlobList = IOptions & IReturnGlobListOptions;
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
export declare type IReturnGlob = string[];
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
export declare function globToList(glob_ls: string[], options?: IOptions): IReturnList;
export interface IReturnGlobListOptions {
    useSourcePath?: boolean;
}
export declare function returnGlobList(ls: IReturnList, options?: IReturnGlobListOptions & IOptions): string[];
export declare function glob_to_list(glob_ls: string[], options?: IOptions): IReturnList2;
export declare function _p_sort_list1(ls: IReturnList2, options?: IOptions): {};
export declare function _p_sort_list2(ls: any, options?: IOptions): IReturnList;
export declare function p_sort_list(ls: IReturnList2, options?: IOptions): IReturnList;
import * as self from './index';
export default self;
