/**
 * Created by user on 2018/1/26/026.
 */
import Promise = require('bluebird');
import globby = require('globby');
export * from './lib';
export { globby };
import { IOptions, IReturnList } from './lib';
export declare function globbySync(options: IOptions): IReturnList;
export declare function globbySync(patterns?: string[], options?: IOptions): IReturnList;
export declare function globbyASync(options: IOptions): Promise<IReturnList>;
export declare function globbyASync(patterns?: string[], options?: IOptions): Promise<IReturnList>;
declare const _default: typeof import(".");
export default _default;
