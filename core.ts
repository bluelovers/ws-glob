/**
 * Created by user on 2018/3/29/029.
 */

import path from 'upath2';
export { path }

export function globToTree(data: string[]): ITree
{
	return data.reduce(function (a, b)
	{
		b = path.normalize(b);
		let dirname = path.dirname(b);
		let basename = path.basename(b);

		let isdir = b.slice(-1) == path.sep;

		if (isdir)
		{
			basename += path.sep;
		}

		//console.log([dirname, basename]);

		if (dirname == '.')
		{
			let f = a;

			f[basename] = isdir ? null : basename;
		}
		else
		{
			let c = dirname
				.split(path.sep)
			;

			if (c[0] == '.')
			{
				c.shift();
			}

			let f = a;

			c.forEach(function (e)
			{
				e += path.sep;

				f[e] = f[e] || {};

				f = f[e];
			});

			f[basename] = isdir ? (f[basename] || {}) : basename;
		}

		return a;
	}, {});
}

export function treeToGlob(a: ITree, d: string[] = []): string[]
{
	return Object.entries(a).reduce(function (a, b)
	{
		//console.log(b);

		if (b[1] === null || typeof b[1] == 'string')
		{
			let k = (b[1] === null ? b[0] : b[1]) as string;

			if (d.length)
			{
				// @ts-ignore
				a.push(path.join(...d, k));
			}
			else
			{
				a.push(k);
			}
		}
		else
		{
			// @ts-ignore
			a = a.concat(treeToGlob(b[1], d.concat(b[0])));
		}

		return a;
	}, [] as string[]);
}

export type ITreeEntries = string | ITreeRow | null;

export type ITreeRow = {
	[key: string]: ITreeEntries;
}

export type ITree = {
	[key: string]: string | ITreeRow | null;
}

import * as self from './core';
export default self;
