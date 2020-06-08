/**
 * Created by user on 2018/2/12/012.
 */
import Bluebird from 'bluebird';
import globby from 'globby';
export * from './index';
export * from './lib';
export { globby };
import { IOptionsWithReturnGlobList, IApiWithReturnGlobAsync, IApiWithReturnGlobSync } from './lib/types';
export declare function globbyASync(options: IOptionsWithReturnGlobList): Bluebird<string[]>;
export declare function globbyASync(patterns?: string[], options?: IOptionsWithReturnGlobList): Bluebird<string[]>;
export declare namespace globbyASync {
    let async: IApiWithReturnGlobAsync;
    function sync(options: IOptionsWithReturnGlobList): string[];
    function sync(patterns?: string[], options?: IOptionsWithReturnGlobList): string[];
}
export declare const globbySync: IApiWithReturnGlobSync;
export declare const async: typeof globbyASync;
export declare const sync: IApiWithReturnGlobSync;
export default globbyASync;
