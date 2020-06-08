/**
 * Created by user on 2020/6/9.
 */
import { IOptionsNovelGlobby as IOptions } from '@lazy-glob/util/lib/types';
export type { IOptionsNovelGlobby as IOptions } from '@lazy-glob/util/lib/types';
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
export interface IForeachArrayDeepCache<D = any, U = any> {
    deep: number;
    data: D;
    temp: U;
    topCache?: IForeachArrayDeepCache<D, U>;
}
export interface IForeachArrayDeepReturn<T, R extends unknown = unknown, D = unknown, U = unknown> {
    ret: R[];
    data: D;
    temp: U;
}
export declare type IArrayDeep<T> = (T | T[] | (T | T[])[])[];
export interface IArrayDeepInterface<T extends unknown> extends Array<T | T[] | IArrayDeepInterface<T>> {
}
