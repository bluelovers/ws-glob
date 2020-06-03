/**
 * Created by user on 2018/1/26/026.
 */

import self = require('../g');
// @ts-ignore
import * as path from 'upath2';
// @ts-ignore
import * as fs from 'fs-iconv';
import * as naturalCompare from 'string-natural-compare';
import { sortTree } from '../lib/glob-sort';
import { getOptionsRuntime, glob_to_list } from '../lib/index';
import { glob_to_list_array_deep } from '../lib/list';
import { getOptions } from '../lib/options';

let a;

let cwd;

cwd = process.cwd();
cwd = 'D:/Users/Documents/The Project/nodejs-test/node-novel2/dist_novel/user_out/自分が異世界に転移するなら';

cwd = 'D:/Users/Documents/The Project/nodejs-test/node-novel2/dist_novel/user_out/黑之魔王';
cwd = 'D:/Users/Documents/The Project/nodejs-test/node-novel2/dist_novel/user_out/回復術士のやり直し～即死魔法とスキルコピーの超越ヒール～';

//cwd = 'D:\\Users\\Documents\\The Project\\nodejs-test\\node-novel2\\dist_novel\\user_out\\暗黒騎士物語　～勇者を倒すために魔王に召喚されました～\\';

cwd = 'D:/Users/Documents/The Project/nodejs-test/node-novel2/dist_novel/girl_out/你這種傢伙別想打贏魔王';

cwd = 'D:/Users/Documents/The Project/nodejs-test/node-novel2/dist_novel/user_out/誰にでもできる影から助ける魔王討伐';

let options = getOptionsRuntime(getOptions({

	cwd: cwd,

	//sortCallback: naturalCompare,

	onListRow(a, row)
	{
		//console.log(row.chapter_title, row.source_idx);

		return row;
	},
}).options);

self
	.globbyASync(options)
	.then(ls => sortTree(ls, null, options))
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
	.then(async function (ls)
	{
		let ret = await glob_to_list_array_deep(ls, options);

		return ret;
	})
	.tap(function (ls)
	{
		//console.log(ls);

		fs.writeJsonSync('./temp/test.json', ls, {
			spaces: "\t",
		});
	})
	.tap(function (ls)
	{
		//console.log(self.globToList(ls));
	})
;
