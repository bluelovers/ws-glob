/**
 * Created by user on 2018/2/12/012.
 */


import Bluebird from 'bluebird';
import novelGlobby, { globby } from './index';
export { globby }

import {
	getOptions,
	returnGlobList,

	IApiWithReturnGlob,
	IOptionsWithReturnGlobList,

	IApiWithReturnGlobSync,
	IApiWithReturnGlobAsync,
} from './lib/index';

export function globbyASync(options: IOptionsWithReturnGlobList): Bluebird<string[]>
export function globbyASync(patterns?: string[], options?: IOptionsWithReturnGlobList): Bluebird<string[]>
export function globbyASync(patterns?, options: IOptionsWithReturnGlobList = {}): Bluebird<string[]>
{
	[patterns, options] = getOptions(patterns, options);

	return novelGlobby.globbyASync(patterns, options)
		.then(function (ls)
		{
			return returnGlobList(ls, options);
		})
	;
}

export namespace globbyASync
{
	export declare let async: IApiWithReturnGlobAsync;

	export function sync(options: IOptionsWithReturnGlobList): string[]
	export function sync(patterns?: string[], options?: IOptionsWithReturnGlobList): string[]
	export function sync(patterns?, options: IOptionsWithReturnGlobList = {}): string[]
	{
		[patterns, options] = getOptions(patterns, options);

		return returnGlobList(novelGlobby.globbySync(patterns, options), options);
	}
}

export const globbySync = globbyASync.sync as IApiWithReturnGlobSync;
globbyASync.async = globbyASync as IApiWithReturnGlobAsync;

export const async = globbyASync;
export const sync = globbyASync.sync as IApiWithReturnGlobSync;

export default globbyASync;
export * from './index';
export * from './lib';
