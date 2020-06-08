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
