/**
 * Created by user on 2018/1/26/026.
 */
import Bluebird from 'bluebird';
import globby from 'globby';
export * from './lib';
export { globby };
import { IOptions } from '@lazy-glob/util/lib/types/glob';
import { globToList } from './lib/index';
import { IReturnList } from './lib/types';
export declare function globbySync(options: IOptions): IReturnList;
export declare function globbySync(patterns?: string[], options?: IOptions): IReturnList;
declare type IglobbyASyncReturnType = ReturnType<typeof globToList>;
export declare function globbyASync(options: IOptions): Bluebird<IglobbyASyncReturnType>;
export declare function globbyASync(patterns?: string[], options?: IOptions): Bluebird<IglobbyASyncReturnType>;
declare const _default: typeof import(".");
export default _default;
