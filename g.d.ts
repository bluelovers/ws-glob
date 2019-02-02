import Promise = require('bluebird');
export * from './index';
export * from './lib';
import { globby } from './index';
export { globby };
import { IApiWithReturnGlob, IOptionsWithReturnGlobList, IApiWithReturnGlobAsync } from './lib';
export declare function globbyASync(options: IOptionsWithReturnGlobList): Promise<string[]>;
export declare function globbyASync(patterns?: string[], options?: IOptionsWithReturnGlobList): Promise<string[]>;
export declare namespace globbyASync {
    let async: IApiWithReturnGlobAsync;
    function sync(options: IOptionsWithReturnGlobList): string[];
    function sync(patterns?: string[], options?: IOptionsWithReturnGlobList): string[];
}
export declare const globbySync: IApiWithReturnGlob<string[]>;
export declare const async: typeof globbyASync;
export declare const sync: IApiWithReturnGlob<string[]>;
export default globbyASync;
