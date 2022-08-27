/**
 * Created by user on 2018/12/4/004.
 */
import { EntryItem, Options } from '@bluelovers/fast-glob';
import Bluebird from 'bluebird';
import { ITSOverwrite } from 'ts-type/lib/type/record';
export declare function globSearch<T extends EntryItem = string>(pattern: string | string[], options?: IOptions<T>): Bluebird<IReturnValue<T>>;
export declare function globSearchSync<T extends EntryItem = string>(pattern: string | string[], options?: IOptions<T>): IReturnValueSync<T>;
export { globSearch as async, globSearchSync as sync, };
export interface IOptions<T extends EntryItem> extends Options {
    cwd?: string;
    deep?: number;
    /**
     * @default current package path
     */
    stopPath?: string | string[] | boolean;
    /**
     * @default true
     */
    followSymlinkedDirectories?: boolean;
    sortCompareFn?: boolean | ((a: T, b: T) => number);
    ignore?: string[];
    disableThrowWhenEmpty?: boolean;
    pathLib?: IPathLibBase;
}
export interface IReturnValue<T extends EntryItem> {
    value: T[];
    cwd: string;
    pattern: string[];
    options: IOptionsRuntime<T>;
    history: string[];
    errData?: Partial<IReturnError<T>>;
}
export interface IReturnValueSync<T extends EntryItem> extends IReturnValue<T> {
    then<R>(fn: (data: IReturnValueSync<T>) => R): R;
    catch<R>(fn: (err: IReturnError<T>) => R): IReturnValueSync<T> & R;
    tap(fn: (data: IReturnValueSync<T>) => any): IReturnValueSync<T>;
    tapCatch(fn: (err: IReturnError<T>) => any): IReturnValueSync<T>;
}
export type IOptionsRuntime<T extends EntryItem> = ITSOverwrite<IOptions<T>, {
    sortCompareFn?(a: T, b: T): number;
    ignore?: string[];
    stopPath?: string[];
}>;
export interface IPathLibBase {
    sep: string;
    normalize(path: string): string;
    resolve(...paths: string[]): string;
    join(...paths: string[]): string;
}
export type IReturnError<T extends EntryItem, E extends Error = Error> = E & {
    message: string;
    _data: {
        cwd: string;
        pattern: string[];
        options: IOptionsRuntime<T>;
        history: string[];
    };
};
export declare function isPromise<T extends Promise<any>>(ret: T): ret is T;
export declare function isPromise<T extends Bluebird<any>>(ret: T): ret is T;
export declare function handleArgs<T extends EntryItem = string>(pattern: string | string[], options?: IOptions<T>): {
    pattern: string[];
    options: IOptionsRuntime<T>;
};
export declare function _error<E extends Error, D extends any>(data: {
    message?: string | any;
    _data?: D;
}, Err?: (new (...args: any[]) => E)): E & {
    _data?: D;
};
export default globSearch;
