/**
 * Created by user on 2018/2/12/012.
 */

export function defaultSortCallback(a, b)
{
	let r = /^(\d+)/;
	let ta;
	let tb;

	if ((ta = r.exec(a)) && (tb = r.exec(b)))
	{
		/*
		console.log(ta, tb);
		console.log(parseInt(ta[0]), parseInt(tb[0]));
		console.log(parseInt(ta), parseInt(tb));
		*/

		let r = parseInt(ta[0]) - parseInt(tb[0]);

		if (r !== 0)
		{
			return r;
		}
	}

	return (a > b) ? 1 : 0;
}

import * as self from './sort';
export default self;
//export default exports;
