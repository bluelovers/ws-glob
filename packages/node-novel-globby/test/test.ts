/**
 * Created by user on 2018/1/26/026.
 */

import self from '..';
// @ts-ignore
import * as path from 'upath2';
// @ts-ignore
import * as fs from 'fs-iconv';
import { returnGlobList } from '../lib/types';

let a;

let cwd;

cwd = process.cwd();
cwd = 'D:/Users/Documents/The Project/nodejs-test/node-novel2/dist_novel/user_out/自分が異世界に転移するなら';

cwd = 'D:/Users/Documents/The Project/nodejs-test/node-novel2/dist_novel/user_out/黑之魔王';
cwd = 'D:/Users/Documents/The Project/nodejs-test/node-novel2/dist_novel/user_out/回復術士のやり直し～即死魔法とスキルコピーの超越ヒール～';

//cwd = 'D:\\Users\\Documents\\The Project\\nodejs-test\\node-novel2\\dist_novel\\user_out\\暗黒騎士物語　～勇者を倒すために魔王に召喚されました～\\';

cwd = 'D:/Users/Documents/The Project/nodejs-test/node-novel2/dist_novel/girl_out/你這種傢伙別想打贏魔王';

cwd = 'D:/Users/Documents/The Project/nodejs-test/node-novel2/dist_novel/user_out/誰にでもできる影から助ける魔王討伐';

self
	.globbyASync({

		cwd: cwd,

		//sortCallback: naturalCompare,

		onListRow(a, row)
		{
			//console.log(row.chapter_title, row.source_idx);

			return row;
		},
	})
	.tap(function (ls)
	{
		//console.log(ls);

		fs.writeJsonSync('./temp/test.json', ls, {
			spaces: "\t",
		});
	})
	.then(returnGlobList)
	.tap(function (ls)
	{
		if (cwd && 0)
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
