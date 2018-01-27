/**
 * Created by user on 2018/1/26/026.
 */

import self from '..';
import * as path from 'path';

let a;

self
	.globbyASync({

		cwd: path.join(process.cwd(), 'empty'),

		onListRow(a, row)
		{
			console.log(row.chapter_title, row.source_idx);

			return row;
		}
	})
	.tap(function (ls)
	{
		console.log(ls);
	})
	.then(self.returnGlobList)
	.tap(function (ls)
	{
		console.log(ls);
	})
	.tap(function (ls)
	{
		console.log(self.globToList(ls));
	})
;
