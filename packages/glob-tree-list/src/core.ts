/**
 * Created by user on 2018/3/29/029.
 */

//export * from './lib/types'
import { SymGlobTree } from '@lazy-glob/util';

export * from '@lazy-glob/util/lib/types';
import path from 'upath2';

import { ITree } from '@lazy-glob/util/lib/types';
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
			let ls = treeToGlob(b[1], d.concat(b[0]));

			if (b[1][SymGlobTree])
			{
				let k = b[0];

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

			a = a.concat(ls);
		}

		return a;
	}, [] as string[]);
}

globToTree.globToTree = globToTree;
globToTree.treeToGlob = treeToGlob;
globToTree.default = globToTree;

export default exports as typeof import('./core');

