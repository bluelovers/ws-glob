import * as Promise from 'bluebird';
export * from './index';
import { IOptionsWithReturnGlobList } from './index';
export interface IApiWithReturnGlob<T> {
    (options: IOptionsWithReturnGlobList): T;
    (patterns?: string[], options?: IOptionsWithReturnGlobList): T;
}
export declare function globbyASync(options: IOptionsWithReturnGlobList): Promise<string[]>;
export declare function globbyASync(patterns?: string[], options?: IOptionsWithReturnGlobList): Promise<string[]>;
export declare type IReturnGlob = string[];
export declare type IApiWithReturnGlobSync = IApiWithReturnGlob<IReturnGlob>;
export declare type IApiWithReturnGlobAsync = IApiWithReturnGlob<Promise<IReturnGlob>>;
export declare namespace globbyASync {
    let async: IApiWithReturnGlobAsync;
    function sync(options: IOptionsWithReturnGlobList): string[];
    function sync(patterns?: string[], options?: IOptionsWithReturnGlobList): string[];
}
export declare const globbySync: IApiWithReturnGlob<string[]>;
export declare const async: typeof globbyASync;
export declare const sync: IApiWithReturnGlob<string[]>;
export default globbyASync;
