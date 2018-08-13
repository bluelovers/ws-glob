/**
 * Created by user on 2018/2/12/012.
 */
import * as Promise from 'bluebird';
export * from './index';
export * from './lib';
import novelGlobby, { globby } from './index';
export { globby };
import { IOptionsWithReturnGlobList, IApiWithReturnGlobAsync } from './lib';
export declare function globbyASync(options: IOptionsWithReturnGlobList): Promise<string[]>;
export declare function globbyASync(patterns?: string[], options?: IOptionsWithReturnGlobList): Promise<string[]>;
export declare namespace globbyASync {
    let async: IApiWithReturnGlobAsync;
    function sync(options: IOptionsWithReturnGlobList): string[];
    function sync(patterns?: string[], options?: IOptionsWithReturnGlobList): string[];
}
export declare const globbySync: novelGlobby.IApiWithReturnGlob<string[]>;
export declare const async: typeof globbyASync;
export declare const sync: novelGlobby.IApiWithReturnGlob<string[]>;
export default globbyASync;
