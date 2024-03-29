/**
 * Created by user on 2018/2/12/012.
 */

import Bluebird from 'bluebird';
import {
	globbyASync as _globbyASync,
	globbySync as _globbySync
} from './index';
import globby from 'globby';
export * from './index';
export * from './lib';

export { globby }

import {
	getOptions,
} from './lib/index';
import {
	returnGlobList,
	IOptionsWithReturnGlobList,
	IApiWithReturnGlobAsync,
	IApiWithReturnGlobSync, IApiWithReturnGlob,
} from './lib/types';

export function globbyASync(options: IOptionsWithReturnGlobList): Bluebird<string[]>
export function globbyASync(patterns?: string[], options?: IOptionsWithReturnGlobList): Bluebird<string[]>
export function globbyASync(patterns?, options: IOptionsWithReturnGlobList = {}): Bluebird<string[]>
{
	[patterns, options] = getOptions(patterns, options);

	return _globbyASync(patterns, options)
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

		return returnGlobList(_globbySync(patterns, options), options);
	}
}

export const globbySync = globbyASync.sync as IApiWithReturnGlobSync;
globbyASync.async = globbyASync as IApiWithReturnGlobAsync;

export const async = globbyASync;
export const sync = globbyASync.sync as IApiWithReturnGlobSync;

export default globbyASync;
