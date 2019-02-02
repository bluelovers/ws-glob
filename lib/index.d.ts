import Promise = require('bluebird');
import path = require('upath2');
export { path };
export * from './options';
import { IOptions, defaultPatternsExclude, getOptions } from './options';
export { IOptions, defaultPatternsExclude, getOptions };
import { normalize_val } from './helper';
export { normalize_val };
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
export declare type IOptionsWithReturnGlobList = IOptions & IReturnGlobListOptions;
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
    [index: number]: IReturnRow[];
    [key: string]: IReturnRow[];
}
export interface IReturnList2 {
    [key: string]: IReturnRow[];
    [index: number]: IReturnRow[];
}
export declare function globToList(glob_ls: string[], options?: IOptions): IReturnList;
export interface IReturnGlobListOptions {
    useSourcePath?: boolean;
}
export declare function returnGlobList(ls: IReturnList, options?: IReturnGlobListOptions & IOptions): string[];
export declare function glob_to_list(glob_ls: string[], options?: IOptions): IReturnList2;
export declare function p_sort_list(ls: IReturnList2, options?: IOptions): IReturnList;
export declare function sortList2(ls: IReturnList2, options?: IOptions): {};
declare const _default: typeof import(".");
export default _default;
