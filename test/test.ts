/**
 * Created by user on 2018/1/26/026.
 */

import * as self from '..';

let a;

self
	.globbyASync({
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
