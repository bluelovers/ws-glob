/**
 * Created by user on 2018/3/30/030.
 */
import { IReturnRow } from './index';
import Bluebird from 'bluebird';
import { GlobbyOptions } from 'globby';
export declare const defaultPatternsExclude: string[];
export declare const defaultPatterns: string[];
export declare const defaultOptions: IOptions;
export declare type IOptions = GlobbyOptions & {
    cwd?: string;
    absolute?: boolean;
    useDefaultPatternsExclude?: boolean;
    disableAutoHandle?: boolean;
    disableSort?: boolean;
    libPromise?: Bluebird<unknown>;
    onListRow?<T>(a: T, row: IReturnRow, options: IOptions): IReturnRow;
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
export declare function getOptions2(options: IOptions): IReturnOptions;
export declare function getOptions2(patterns?: string[], options?: IOptions): IReturnOptions;
export declare function getOptionsRuntime(options: IOptions | IReturnOptions["options"]): IReturnOptions["options"];
declare const _default: typeof import("./options");
export default _default;
