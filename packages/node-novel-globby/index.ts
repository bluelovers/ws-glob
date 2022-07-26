/**
 * Created by user on 2018/1/26/026.
 */

import Bluebird from 'bluebird';
import globby from 'globby';
export * from './lib';

export { globby }

import { IOptions, } from '@lazy-glob/util/lib/types/glob';

import { globToList, } from './lib/index';
import { getOptions } from './lib/options';
import { IReturnList } from './lib/types';

export function globbySync(options: IOptions): IReturnList
export function globbySync(patterns?: string[], options?: IOptions): IReturnList
export function globbySync(patterns?, options: IOptions = {}): IReturnList
{
	{
		let ret = getOptions(patterns, options);
		[patterns, options] = [ret.patterns, ret.options];
	}

	// @ts-ignore
	let ls = globby.sync(patterns, options);

	return globToList(ls, options);
}

type IglobbyASyncReturnType = ReturnType<typeof globToList>;

export function globbyASync(options: IOptions): Bluebird<IglobbyASyncReturnType>
export function globbyASync(patterns?: string[], options?: IOptions): Bluebird<IglobbyASyncReturnType>
export function globbyASync(patterns?, options: IOptions = {}): Bluebird<IglobbyASyncReturnType>
{
	{
		/*
		let ret = getOptions(patterns, options);
		[patterns, options] = [ret.patterns, ret.options];
		*/

		[patterns, options] = getOptions(patterns, options);
	}

	// @ts-ignore
	let ls = globby(patterns, options);

	// @ts-ignore
	let p: typeof Bluebird = options.libPromise ? options.libPromise : Bluebird;

	return p.resolve(ls)
		.then(function (ls)
		{
			if ((!ls || !ls.length) && options.throwEmpty)
			{
				return Bluebird.reject(new Error(`glob matched list is empty`)) as any as IglobbyASyncReturnType;
			}

			return globToList(ls, options);
		})
		;
}

export default exports as typeof import('./index');
