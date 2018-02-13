/**
 * Created by user on 2018/1/26/026.
 */

import * as Promise from 'bluebird';
import * as globby from 'globby';
export * from './lib';

export { globby }

import {
	getOptions,

	IOptions,
	IReturnList,
	globToList,

} from './lib';

export function globbySync(options: IOptions): IReturnList
export function globbySync(patterns?: string[], options?: IOptions): IReturnList
export function globbySync(patterns?, options: IOptions = {}): IReturnList
{
	{
		let ret = getOptions(patterns, options);
		[patterns, options] = [ret.patterns, ret.options];
	}

	let ls = globby.sync(patterns, options);

	return globToList(ls, options);
}

export function globbyASync(options: IOptions): Promise<IReturnList>
export function globbyASync(patterns?: string[], options?: IOptions): Promise<IReturnList>
export function globbyASync(patterns?, options: IOptions = {}): Promise<IReturnList>
{
	{
		/*
		let ret = getOptions(patterns, options);
		[patterns, options] = [ret.patterns, ret.options];
		*/

		[patterns, options] = getOptions(patterns, options);
	}

	let ls = globby(patterns, options);

	let p: Promise = options.libPromise ? options.libPromise : Promise;

	return p.resolve(ls)
		.then(function (ls)
		{
			if ((!ls || !ls.length) && options.throwEmpty)
			{
				return Promise.reject(new Error(`glob matched list is empty`));
			}

			return globToList(ls, options);
		})
		;
}

import * as self from './index';
export default self;
