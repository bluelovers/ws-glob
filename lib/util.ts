/**
 * Created by user on 2019/5/6.
 */

import Bluebird = require('bluebird');
import { normalize_strip } from '@node-novel/normalize';

export interface IForeachArrayDeepCache<D = any, U = any>
{
	deep: number,
	data: D,
	temp: U,
	topCache?: IForeachArrayDeepCache<D, U>,
}

export interface IForeachArrayDeepReturn<T, R extends unknown = unknown, D = unknown, U = unknown>
{
	ret: R[];
	data: D;
	temp: U;
}

export function eachVolumeTitle(volume_title: string | string[], strip: boolean = true)
{
	let vs: string[];

	if (Array.isArray(volume_title))
	{
		vs = volume_title;
		volume_title = volume_title.join('/');
	}
	else
	{
		vs = volume_title
			.split('/')
		;
	}

	if (strip)
	{
		vs = vs.map(t => normalize_strip(t, true));
	}

	let ret = {
		volume_title,
		level: vs.length,
		titles: [] as string[],
		titles_full: [] as string[],
	};

	let a: string;

	vs
		.forEach((b) => {

			ret.titles.push(b);

			if (a != null)
			{
				a += '/' + b;
			}
			else
			{
				a = b;
			}

			ret.titles_full.push(a);
		})
	;

	return ret;
}

export function foreachArrayDeep<T, R extends unknown = unknown, D = unknown, U = unknown>(arr: IArrayDeepInterface<T>, fn: (argv: {
	value: T,
	index: number,
	array: IArrayDeepInterface<T>,

	cache: IForeachArrayDeepCache<D, U>,
}) => R | void, initCache?: Partial<IForeachArrayDeepCache<D, U>>): IForeachArrayDeepReturn<T, R, D, U>
{
	let topCache: IForeachArrayDeepCache<D, U> = {
		data: {} as any,
		temp: {} as any,

		...initCache,

		deep: 0,
	};

	topCache.topCache = topCache;

	let ret = arr
		.map(((value, index, array) => {
			return fnDeep(value, index, array, topCache)
		}))
	;

	function fnDeep(value: T | IArrayDeepInterface<T>, index: number, array: IArrayDeepInterface<T>, cache: IForeachArrayDeepCache<D, U>)
	{
		if (Array.isArray(value))
		{
			return value.map((value, index, array) => {
				return fnDeep(value, index, array, {
					...cache,
					deep: cache.deep + 1,
				})
			})
		}
		else
		{
			return fn({
				value, index, array,
				cache,
			})
		}
	}

	return {
		ret,
		data: topCache.data,
		temp: topCache.temp,
	};
}

export function foreachArrayDeepAsync<T, R extends unknown = unknown, D = unknown, U = unknown>(arr: IArrayDeepInterface<T>, fn: (argv: {
	value: T,
	index: number,
	array: IArrayDeepInterface<T>,

	cache: IForeachArrayDeepCache<D, U>,
}) => PromiseLike<R> | void, initCache?: Partial<IForeachArrayDeepCache<D, U>>): Bluebird<IForeachArrayDeepReturn<T, R, D, U>>
{
	let topCache: IForeachArrayDeepCache<D, U> = {
		data: {} as any,
		temp: {} as any,

		...initCache,

		deep: 0,
	};

	topCache.topCache = topCache;

	return Bluebird.resolve(null)
		.then(async function ()
		{
			let ret = await Bluebird.resolve(arr)
				.mapSeries(((value, index, array) => {
					return fnDeep(value, index, array, topCache)
				}))
			;

			function fnDeep(value: T | IArrayDeepInterface<T>, index: number, array: IArrayDeepInterface<T>, cache: IForeachArrayDeepCache<D, U>)
			{
				if (Array.isArray(value))
				{
					return Bluebird.resolve(value).mapSeries((value, index, array) => {
						return fnDeep(value, index, array, {
							...cache,
							deep: cache.deep + 1,
						})
					})
				}
				else
				{
					return fn({
						value, index, array,
						cache,
					})
				}
			}

			return {
				ret,
				data: topCache.data,
				temp: topCache.temp,
			};
		})
	;
}

export type IArrayDeep<T> = (T | T[] | (T | T[])[])[]

export interface IArrayDeepInterface<T extends unknown> extends Array<T | T[] | IArrayDeepInterface<T>>
{

}
