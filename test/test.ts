/**
 * Created by user on 2018/1/26/026.
 */

import * as self from '..';

self.globbyASync()
	.tap(function (ls)
	{
		console.log(ls);
	})
	.then(self.returnGlobList)
	.tap(function (ls)
	{
		console.log(ls);
	})
;
