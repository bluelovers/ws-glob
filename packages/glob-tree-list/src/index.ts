/**
 * Created by user on 2018/3/29/029.
 */

import { SymGlobTree } from '@lazy-glob/util';
import {
	join,
	normalize,
	sep,
	dirname as _dirname,
	basename as _basename,
} from 'upath2';
import { ITree } from '@lazy-glob/util/lib/types';

export type { ITree }

export function globToTree(data: string[]): ITree
{
	return data.reduce(function (a, b)
	{
		b = normalize(b);
		let dirname = _dirname(b);
		let basename = _basename(b);

		const isdir = b.slice(-1) === sep;

		if (isdir)
		{
			basename += sep;
		}

		//console.log([dirname, basename]);

		if (dirname === '.')
		{
			const f = a;

			f[basename] = isdir ? null : basename;
		}
		else
		{
			const c = dirname
				.split(sep)
			;

			if (c[0] === '.')
			{
				c.shift();
			}

			let f = a;

			c.forEach(function (e)
			{
				e += sep;

				// @ts-ignore
				f[e] = f[e] || {};

				// @ts-ignore
				f = f[e];
			});

			f[basename] = isdir ? (f[basename] || {}) : basename;

			if (isdir)
			{
				// @ts-ignore
				f[basename][SymGlobTree] = true;
				//console.dir({ b, basename, f })
			}
		}

		return a;
	}, {} as ITree);
}

export function treeToGlob(a: ITree, d: string[] = []): string[]
{
	return Object.entries(a).reduce(function (a, b)
	{
		//console.log(b);

		if (b[1] === null || typeof b[1] === 'string')
		{
			const k = (b[1] === null ? b[0] : b[1]) as string;

			if (d.length)
			{
				a.push(join(...d as [string], k));
			}
			else
			{
				a.push(k);
			}
		}
		else
		{
			const ls = treeToGlob(b[1], d.concat(b[0]));

			if (b[1][SymGlobTree])
			{
				let k = b[0];

				if (d.length)
				{
					a.push(join(...d as [string], k));
				}
				else
				{
					a.push(k);
				}
			}

			a = a.concat(ls);
		}

		return a;
	}, [] as string[]);
}

Object.defineProperty(globToTree, "__esModule", { value: true });
Object.defineProperty(globToTree, "globToTree", { value: globToTree });
Object.defineProperty(globToTree, "treeToGlob", { value: treeToGlob });
Object.defineProperty(globToTree, "default", { value: globToTree });

export default globToTree
