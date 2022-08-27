/**
 * Created by user on 2020/6/9.
 */
import { IOptions } from '@lazy-glob/util/lib/types/glob';
import Bluebird from 'bluebird';
export interface IApi<T> {
    (options: IOptions): T;
    (patterns?: string[], options?: IOptions): T;
}
export type IApiSync = IApi<IReturnList>;
export type IApiAsync = IApi<Bluebird<IReturnList>>;
export interface IApiWithReturnGlob<T> {
    (options: IOptionsWithReturnGlobList): T;
    (patterns?: string[], options?: IOptionsWithReturnGlobList): T;
}
export type IApiWithReturnGlobSync = IApiWithReturnGlob<IReturnGlob>;
export type IApiWithReturnGlobAsync = IApiWithReturnGlob<Bluebird<IReturnGlob>>;
export type IOptionsWithReturnGlobList = IOptions & IReturnGlobListOptions;
export type IReturnGlob = string[];
export interface IReturnRow {
    source_idx: number;
    source_totals: number;
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
