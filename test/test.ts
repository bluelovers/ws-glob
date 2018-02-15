/**
 * Created by user on 2018/1/26/026.
 */

import self from '..';
import * as path from 'path';
import * as fs from 'fs';

let a;

let cwd;

cwd = process.cwd();
cwd = 'D:/Users/Documents/The Project/nodejs-test/node-novel2/dist_novel/user_out/自分が異世界に転移するなら';

cwd = 'D:/Users/Documents/The Project/nodejs-test/node-novel2/dist_novel/user_out/黑之魔王';
cwd = 'D:/Users/Documents/The Project/nodejs-test/node-novel2/dist_novel/user_out/回復術士のやり直し～即死魔法とスキルコピーの超越ヒール～';

self
	.globbyASync({

		cwd: cwd,

		onListRow(a, row)
		{
			//console.log(row.chapter_title, row.source_idx);

			return row;
		},
	})
	.tap(function (ls)
	{
		console.log(ls);
	})
	.then(self.returnGlobList)
	.tap(function (ls)
	{
		if (cwd)
		{
			ls = ls.map(function (p)
			{
				return path.relative(cwd, p);
			})
		}

		//console.dir(ls);

		fs.writeFileSync('./temp/test.txt', ls.join("\n"));
	})
	.tap(function (ls)
	{
		//console.log(self.globToList(ls));
	})
;
