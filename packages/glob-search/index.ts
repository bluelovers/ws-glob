/**
 * Created by user on 2018/12/4/004.
 */

import { pathExists, pathExistsSync } from 'fs-extra';
import { EntryItem, sync as syncFastGlob, async as asyncFastGlob, Options } from '@bluelovers/fast-glob';
import Bluebird from 'bluebird';
import _path from 'path';
import { expect } from 'chai';
import { naturalCompare } from '@bluelovers/string-natural-compare';
import { ITSOverwrite } from 'ts-type/lib/type/record';
import { findRoot } from '@yarn-tool/find-root';

export function globSearch<T extends EntryItem = string>(pattern: string | string[], options?: IOptions<T>)
{
	({ pattern, options } = handleArgs(pattern, options));

	const path = options.pathLib as IOptionsRuntime<T>["pathLib"];

	return new Bluebird<IReturnValue<T>>(async (resolve, reject) =>
	{
		let cwd = path.normalize(options.cwd);
		let opts = Object.assign({}, options) as IOptionsRuntime<T>;

		let history: string[] = [];
		let bool = true;

		if (await pathExists(cwd))
		{
			while (bool)
			{
				if (cwd === '.' || cwd === '..')
				{
					cwd = path.resolve(cwd);
				}

				history.push(cwd);

				//console.log(cwd);

				opts.cwd = cwd;

				let value = await asyncFastGlob<T>(pattern, opts)
					.catch(function (e)
					{
						bool = false;

						e._data = {
							cwd,
							pattern: pattern as string[],
							options: opts,
							history,
						};

						reject(e);
					}) as T[]
				;

				if (!bool)
				{
					return;
				}

				if (value.length)
				{
					if (opts.sortCompareFn)
					{
						value.sort(opts.sortCompareFn);
					}

					resolve({
						value,
						cwd,
						pattern: pattern as string[],
						options: opts,
						history,
					});

					break;
				}

				//console.log(cwd);

				if (opts.stopPath.includes(cwd))
				{
					//bool = false;
					rejectFail(`stop search at ${cwd}`);

					break;
				}

				/*
				let t = path.resolve(cwd);

				opts.ignore.push(cwd + path.sep);
				opts.ignore.push(cwd + path.sep + '**');

				if (t != cwd)
				{
					opts.ignore.push(t + path.sep);
					opts.ignore.push(t + path.sep + '**');
				}
				*/

				cwd = path.resolve(cwd, '..');

				if (cwd === opts.cwd)
				{
					//bool = false;
					rejectFail(`there is no any parent path: ${cwd}`);

					break;
				}
			}

			if (bool)
			{
				rejectFail(`unknow error`);
			}
		}
		else
		{
			rejectFail(`path not exists ${cwd}`);
		}

		function rejectFail(message: string)
		{
			bool = false;

			if (opts.disableThrowWhenEmpty)
			{
				resolve({
					value: [],
					cwd,
					pattern: pattern as string[],
					options: opts,
					history,
					errData: {
						message,
						_data: {
							cwd,
							pattern: pattern as string[],
							options: opts,
							history,
						}
					},
				})
			}
			else
			{
				reject(_error({
					message,
					_data: {
						cwd,
						pattern: pattern as string[],
						options: opts,
						history,
					}
				}));
			}
		}
	})
}

export function globSearchSync<T extends EntryItem = string>(pattern: string | string[], options?: IOptions<T>): IReturnValueSync<T>
{
	({ pattern, options } = handleArgs(pattern, options));

	const path = options.pathLib as IOptionsRuntime<T>["pathLib"];

	let cwd = path.normalize(options.cwd);
	let opts = Object.assign({}, options) as IOptionsRuntime<T>;

	let history: string[] = [];
	let bool = true;

	if (pathExistsSync(cwd))
	{
		while (bool)
		{
			if (cwd === '.' || cwd === '..')
			{
				cwd = path.resolve(cwd);
			}

			history.push(cwd);

			//console.log(cwd);

			opts.cwd = cwd;

			let value: T[];

			try
			{
				value = syncFastGlob<T>(pattern, opts);
			}
			catch (e)
			{
				return rejectFail(e)
			}

			if (!bool)
			{
				return;
			}

			if (value.length)
			{
				if (opts.sortCompareFn)
				{
					value.sort(opts.sortCompareFn);
				}

				return resolve({
					value,
					cwd,
					pattern,
					options: opts,
					history,
				});

				break;
			}

			//console.log(cwd);

			if (opts.stopPath.includes(cwd))
			{
				//bool = false;
				return rejectFail(`stop search at ${cwd}`);

				break;
			}

			/*
			let t = path.resolve(cwd);

			opts.ignore.push(cwd + path.sep);
			opts.ignore.push(cwd + path.sep + '**');

			if (t != cwd)
			{
				opts.ignore.push(t + path.sep);
				opts.ignore.push(t + path.sep + '**');
			}
			*/

			cwd = path.resolve(cwd, '..');

			if (cwd === opts.cwd)
			{
				//bool = false;
				return rejectFail(`there is no any parent path: ${cwd}`);

				break;
			}
		}
	}
	else
	{
		return rejectFail(`path not exists ${cwd}`);
	}

	return rejectFail(`unknow error`);

	function rejectFail<E extends string | Error>(message: E)
	{
		bool = false;

		if (message instanceof Error)
		{
			// @ts-ignore
			message._data = {
				cwd,
				pattern,
				options: opts,
				history,
			};

			throw message;
		}

		if (opts.disableThrowWhenEmpty)
		{
			return resolve({
				value: [],
				cwd,
				pattern: pattern as string[],
				options: opts,
				history,
				errData: {
					// @ts-ignore
					message,
					_data: {
						cwd,
						pattern: pattern as string[],
						options: opts,
						history,
					}
				},
			})
		}
		else
		{
			throw _error({
				message,
				_data: {
					cwd,
					pattern: pattern as string[],
					options: opts,
					history,
				}
			});
		}
	}

	function resolve<R extends IReturnValue<T>>(data: R): IReturnValueSync<T>
	{
		return Object.assign(data, {

			then: function fakeThen(fn)
			{
				delete (data as any as IReturnValueSync<T>).then;

				let ret = fn(data);

				handlePromise(ret, data);

				return ret;
			},

			catch: function fakeCatch(fn)
			{
				delete (data as any as IReturnValueSync<T>).catch;

				let e = null;

				if (data.errData)
				{
					e = _error(data.errData);

					let ret = fn(e);

					handlePromise(ret, data);

					return ret;
				}
				else
				{
					return data
				}
			},

			tap: function fakeTap(fn)
			{
				delete (data as any as IReturnValueSync<T>).tap;

				let ret = fn(data);

				if (handlePromise(ret, data))
				{
					return ret.then(function ()
					{
						return data;
					})
				}

				return data;
			},
			tapCatch: function fakeTapCatch(fn)
			{
				let e = null;

				delete (data as any as IReturnValueSync<T>).tapCatch;

				if (data.errData)
				{
					e = _error(data.errData);
				}

				let ret = fn(e);

				if (handlePromise(ret, data))
				{
					return ret.then(function ()
					{
						return data;
					})
				}

				return data;
			},
		})
	}

	function handlePromise(ret, data: IReturnValueSync<T> | IReturnValue<T>)
	{
		if (ret !== data && isPromise(ret))
		{
			delete (data as any as IReturnValueSync<T>).tap;
			delete (data as any as IReturnValueSync<T>).tapCatch;
			delete (data as any as IReturnValueSync<T>).then;
			delete (data as any as IReturnValueSync<T>).catch;

			return true;
		}

		return false;
	}
}

export {
	globSearch as async,
	globSearchSync as sync,
}

export interface IOptions<T extends EntryItem> extends Options
{
	cwd?: string,
	deep?: number;

	/**
	 * @default current package path
	 */
	stopPath?: string | string[] | boolean;

	/**
	 * @default true
	 */
	followSymlinkedDirectories?: boolean,

	sortCompareFn?: boolean | ((a: T, b: T) => number),

	ignore?: string[],

	disableThrowWhenEmpty?: boolean,

	pathLib?: IPathLibBase,
}

export interface IReturnValue<T extends EntryItem>
{
	value: T[],
	cwd: string,

	pattern: string[],
	options: IOptionsRuntime<T>,
	history: string[],

	errData?: Partial<IReturnError<T>>,
}

export interface IReturnValueSync<T extends EntryItem> extends IReturnValue<T>
{
	then<R>(fn: (data: IReturnValueSync<T>) => R): R,
	catch<R>(fn: (err: IReturnError<T>) => R): IReturnValueSync<T> & R,

	tap(fn: (data: IReturnValueSync<T>) => any): IReturnValueSync<T>,
	tapCatch(fn: (err: IReturnError<T>) => any): IReturnValueSync<T>,
}

export type IOptionsRuntime<T extends EntryItem> = ITSOverwrite<IOptions<T>, {
	sortCompareFn?(a: T, b: T): number,
	ignore?: string[],
	stopPath?: string[];

	//pathLib?: IPathLibBase & typeof _path & typeof _upath,
}>

export interface IPathLibBase
{
	sep: string,
	normalize(path: string): string;
	resolve(...paths: string[]): string;
	join(...paths: string[]): string;
}

export type IReturnError<T extends EntryItem, E extends Error = Error> = E & {
	message: string,
	_data: {
		cwd: string,

		pattern: string[],
		options: IOptionsRuntime<T>,

		history: string[],
	},
}

export function isPromise<T extends Promise<any>>(ret: T): ret is T
export function isPromise<T extends Bluebird<any>>(ret: T): ret is T
export function isPromise(ret)
{
	if (Bluebird.is(ret))
	{
		return true
	}
	else if (ret instanceof Promise)
	{
		return true
	}

	return false
}

export function handleArgs<T extends EntryItem = string>(pattern: string | string[], options?: IOptions<T>): {
	pattern: string[],
	options: IOptionsRuntime<T>,
}
{
	if (typeof pattern === 'string')
	{
		pattern = [pattern];
	}

	expect(pattern).is.an('array');

	pattern = pattern.filter(v => typeof v === 'string' && v !== '');

	expect(pattern).have.lengthOf.gt(0);

	let opts = Object.assign({
		followSymlinkedDirectories: true,
		markDirectories: true,
		unique: true,
		cwd: process.cwd(),
		//stopPath: [],
		ignore: [],
	}, options || {});

	expect(opts.cwd).is.an('string');

	opts.pathLib = opts.pathLib || _path;
	const path = opts.pathLib as IOptionsRuntime<T>["pathLib"];

	expect(path.join).is.an('function');
	expect(path.sep).is.an('string');
	expect(path.normalize).is.an('function');
	expect(path.resolve).is.an('function');

	let cwd = path.normalize(opts.cwd);

	if (cwd === '.' || cwd === '..')
	{
		cwd = path.resolve(cwd);
	}

	opts.cwd = cwd;

	if (opts.stopPath == null || opts.stopPath === true)
	{
		let { root } = findRoot({
			cwd
		});

		opts.stopPath = [];
		if (root)
		{
			opts.stopPath.push(root);
		}
	}
	else if (typeof opts.stopPath === 'string')
	{
		opts.stopPath = [opts.stopPath];
	}
	else if (opts.stopPath === false)
	{
		opts.stopPath = [];
	}

	expect(opts.stopPath).is.an('array');

	opts.stopPath = opts.stopPath.map(v =>
	{

		if (typeof v !== 'string')
		{
			expect(v, `options.stopPath must is string or string[]`).is.an('string');
		}

		return path.normalize(v)
	});

	if (typeof opts.ignore === 'string')
	{
		opts.ignore = [opts.ignore];
	}
	else
	{
		opts.ignore ??= [];
	}

	expect(opts.ignore).is.an('array');

	opts.ignore.forEach(v =>
	{
		if (typeof v !== 'string')
		{
			expect(v, `options.ignore must is string[]`).is.an('string');
		}
	});

	if (opts.sortCompareFn === true || opts.sortCompareFn == null)
	{
		// @ts-ignore
		opts.sortCompareFn = naturalCompare;
	}
	else if (opts.sortCompareFn)
	{
		expect(opts.sortCompareFn).is.an('function');
	}
	else
	{
		opts.sortCompareFn = null
	}

	opts.disableThrowWhenEmpty = !!opts.disableThrowWhenEmpty;

	return {
		pattern,
		// @ts-ignore
		options: opts,
	}
}

export function _error<E extends Error, D extends any>(data: {
	message?: string | any,
	_data?: D,
	// @ts-ignore
}, Err: (new (...args) => E) = Error): E & {
	_data?: D
}
{
	let e = new Err(data.message || data._data);
	// @ts-ignore
	e._data = data._data;
	// @ts-ignore
	return e;
}

export default globSearch
