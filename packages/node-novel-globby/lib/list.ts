import { getOptionsRuntime } from './options';

export * from '@lazy-glob/util/lib/types/glob';
import { IOptions, IArrayDeepInterface } from '@lazy-glob/util/lib/types/glob';

import { normalize_strip, normalize_val } from '@node-novel/normalize';
import { eachVolumeTitle } from './util';
import path from 'upath2';
import { IReturnRow } from './types';

export { IReturnRow }

export function glob_to_list_array(glob_ls: string[], options: IOptions = {}): IReturnRow[]
{
	if (!Array.isArray(glob_ls) || !glob_ls.length)
	{
		throw new Error(`glob matched list is empty`);
	}

	options = getOptionsRuntime({
		...options,
	});

	return glob_ls.reduce(function (a, b: string, source_idx: number)
	{
		let row = pathToListRow(b, source_idx, options);

		if (options.onListRow)
		{
			row = options.onListRow(a, row, options);

			if (!row)
			{
				throw new Error('onListRow');
			}
		}

		//let keys = row.val_dir.split('/');

		// 防止純數字的資料夾名稱導致排序失敗
		//let key = keys[0] + '.dir';

		a.push(row);

		return a;
	}, [] as IReturnRow[]);
}

export function glob_to_list_array_deep(glob_ls: string[], options: IOptions = {}): IArrayDeepInterface<IReturnRow>
{
	if (!Array.isArray(glob_ls) || !glob_ls.length)
	{
		throw new Error(`glob matched list is empty`);
	}

	options = getOptionsRuntime({
		...options,
	});

	let cache: {
		[key: string]: IArrayDeepInterface<IReturnRow>,
	} = {};

	return glob_ls.reduce(function (a, b: string, source_idx: number)
	{
		let row = pathToListRow(b, source_idx, options);

		if (options.onListRow)
		{
			row = options.onListRow(a, row, options);

			if (!row)
			{
				throw new Error('onListRow');
			}
		}

		let keys = row.val_dir.split('/');

		if (keys.length)
		{
			let aa = eachVolumeTitle(keys, false).titles_full
				.reduce((aa, key) =>
				{

					let ca = cache[key] = cache[key] || [];

					if (!aa.includes(ca))
					{
						aa.push(ca);
					}

					aa = ca;

					return aa;
				}, a as IArrayDeepInterface<IReturnRow>)
			;

			aa.push(row);

			/*
			let pkey: string;

			keys.forEach(function (bb, i)
			{
				let key: string;

				if (pkey == null)
				{
					key = bb;
				}
				else
				{
					key = pkey + bb;
				}

				key += '/';

				let ca = cache[key] = cache[key] || [];

				if (!i)
				{
					aa = a;
				}

				if (!aa.includes(ca))
				{
					aa.push(ca);
				}

				aa = ca;
				pkey = key;
			});

			aa.push(row);
			 */
		}
		else
		{
			a.push(row);
		}

		return a;
	}, [] as IArrayDeepInterface<IReturnRow>);
}

export function pathToListRow(b: string, source_idx: number, options: IOptions = {}): IReturnRow
{
	options = getOptionsRuntime(options);

	const padNum = options.padNum;
	const CWD = options.cwd;

	let dir = path.dirname(b);
	let ext = path.extname(b);
	let file = path.basename(b, ext);

	if (options.absolute)
	{
		// fix bug when absolute: true
		dir = path.relative(CWD, dir);
	}

	//console.log(b);

	let row: IReturnRow = {
		source_path: b,

		source_idx,

		path: options.cwd && !path.isAbsolute(b) ? path.join(options.cwd, b) : b,
		path_dir: options.cwd && !path.isAbsolute(dir) ? path.join(options.cwd, dir) : dir,

		dir: dir,
		file: file,
		ext: ext,

		volume_title: dir.trim(),
		chapter_title: file.trim(),

		val_file: file.trim(),
		val_dir: dir.trim(),
	};

	if (!options.disableAutoHandle)
	{
		row.volume_title = normalize_strip(row.volume_title, true);
		row.chapter_title = normalize_strip(row.chapter_title);

		row.val_dir = normalize_val(row.val_dir, padNum, options);
		row.val_file = normalize_val(row.val_file, padNum, options);
	}

	return row
}

export default exports as typeof import('./list');
