/**
 * Created by user on 2020/6/9.
 */

import { IOptions } from '@lazy-glob/util/lib/types/glob';
import Bluebird from 'bluebird';

export interface IApi<T>
{
	(options: IOptions): T

	(patterns?: string[], options?: IOptions): T
}

export type IApiSync = IApi<IReturnList>;
export type IApiAsync = IApi<Bluebird<IReturnList>>;

export interface IApiWithReturnGlob<T>
{
	(options: IOptionsWithReturnGlobList): T

	(patterns?: string[], options?: IOptionsWithReturnGlobList): T
}

export type IApiWithReturnGlobSync = IApiWithReturnGlob<IReturnGlob>;
export type IApiWithReturnGlobAsync = IApiWithReturnGlob<Bluebird<IReturnGlob>>;
export type IOptionsWithReturnGlobList = IOptions & IReturnGlobListOptions;
export type IReturnGlob = string[];

export interface IReturnRow
{
	source_idx: number,
	source_totals: number,
	source_path: string,
	path: string,
	path_dir: string,
	dir: string,
	file: string,
	ext: string,
	volume_title: string,
	chapter_title: string,
	val_file: string,
	val_dir: string,
}

export interface IReturnList
{
	[index: number]: IReturnRow[],

	[key: string]: IReturnRow[],
}

export interface IReturnList2
{
	/*
	[key: string]: {
		[index: number]: IReturnRow,
		[key: string]: IReturnRow,
	},
	*/
	[key: string]: IReturnRow[],

	[index: number]: IReturnRow[],
}

export interface IReturnGlobListOptions
{
	useSourcePath?: boolean,
}

export function returnGlobList(ls: IReturnList, options: IReturnGlobListOptions & IOptions = {}): string[]
{
	let useSourcePath = (options.useSourcePath === true || options.useSourcePath === false)
		? options.useSourcePath
		: !options.absolute;

	if (!ls)
	{
		return [];
	}

	return Object.values(ls)
		.reduce(function (a: string[], b)
		{
			Object.values(b)
				.forEach(function (value, index, array)
				{
					a.push(useSourcePath ? value.source_path : value.path);
				})
			;

			return a;
		}, [])
		;

	/*
	return Object.keys(ls)
		.reduce(function (a: string[], b)
		{
			ls[b].forEach(function (value, index, array)
			{
				a.push(useSourcePath ? value.source_path : value.path);
			});

			return a;
		}, [])
		;
	*/
}
