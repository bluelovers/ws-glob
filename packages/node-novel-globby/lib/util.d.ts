/**
 * Created by user on 2019/5/6.
 */
import Bluebird from 'bluebird';
import { IArrayDeepInterface, IForeachArrayDeepReturn, IForeachArrayDeepCache } from '@lazy-glob/util/lib/types/glob';
export * from '@lazy-glob/util/lib/types/glob';
export declare function eachVolumeTitle(volume_title: string | string[], strip?: boolean): {
    volume_title: string;
    level: number;
    titles: string[];
    titles_full: string[];
};
export declare function foreachArrayDeep<T, R extends unknown = unknown, D = unknown, U = unknown>(arr: IArrayDeepInterface<T>, fn: (argv: {
    value: T;
    index: number;
    array: IArrayDeepInterface<T>;
    cache: IForeachArrayDeepCache<D, U>;
}) => R | void, initCache?: Partial<IForeachArrayDeepCache<D, U>>): IForeachArrayDeepReturn<T, R, D, U>;
export declare function foreachArrayDeepAsync<T, R extends unknown = unknown, D = unknown, U = unknown>(arr: IArrayDeepInterface<T>, fn: (argv: {
    value: T;
    index: number;
    array: IArrayDeepInterface<T>;
    cache: IForeachArrayDeepCache<D, U>;
}) => PromiseLike<R> | void, initCache?: Partial<IForeachArrayDeepCache<D, U>>): Bluebird<IForeachArrayDeepReturn<T, R, D, U>>;
