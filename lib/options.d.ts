/**
 * Created by user on 2018/3/30/030.
 */
import { IReturnList2, IReturnRow } from './index';
import Promise = require('bluebird');
import { IOptions as IGlobOptions } from 'glob';
export declare const defaultPatternsExclude: string[];
export declare const defaultPatterns: string[];
export declare const defaultOptions: IOptions;
export declare type IOptions = IGlobOptions & {
    cwd?: string;
    absolute?: boolean;
    useDefaultPatternsExclude?: boolean;
    disableAutoHandle?: boolean;
    disableSort?: boolean;
    libPromise?: Promise<unknown>;
    onListRow?: (a: IReturnList2, row: IReturnRow, options: IOptions) => IReturnRow;
    throwEmpty?: boolean;
    sortCallback?(a: any, b: any): number;
    sortFn?<T>(arr: T): T;
    padNum?: number;
    checkRoman?: boolean;
};
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
export declare function getOptions(options: IOptions): IReturnOptions;
export declare function getOptions(patterns?: string[], options?: IOptions): IReturnOptions;
declare const _default: typeof import("./options");
export default _default;
