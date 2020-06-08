/**
 * Created by user on 2020/6/9.
 */
import { IOptions } from '@lazy-glob/util/lib/types/glob';
import Bluebird from 'bluebird';
export interface IApi<T> {
    (options: IOptions): T;
    (patterns?: string[], options?: IOptions): T;
}
export declare type IApiSync = IApi<IReturnList>;
export declare type IApiAsync = IApi<Bluebird<IReturnList>>;
export interface IApiWithReturnGlob<T> {
    (options: IOptionsWithReturnGlobList): T;
    (patterns?: string[], options?: IOptionsWithReturnGlobList): T;
}
export declare type IApiWithReturnGlobSync = IApiWithReturnGlob<IReturnGlob>;
export declare type IApiWithReturnGlobAsync = IApiWithReturnGlob<Bluebird<IReturnGlob>>;
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
export interface IReturnGlobListOptions {
    useSourcePath?: boolean;
}
export declare function returnGlobList(ls: IReturnList, options?: IReturnGlobListOptions & IOptions): string[];
