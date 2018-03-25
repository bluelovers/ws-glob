/**
 * Created by user on 2018/2/12/012.
 */

import * as naturalCompare from 'string-natural-compare';

export { naturalCompare }

export function defaultSortCallback(a, b, cache = {})
{
	if (a === b)
	{
		return 0;
	}

	let r = /^(\d+(?:\.\d+)?)/;
	let ta: RegExpExecArray;
	let tb: RegExpExecArray;

	if ((ta = r.exec(_trim(a))) && (tb = r.exec(_trim(b))))
	{
		/*
		console.log(a, b);
		console.log(ta, tb);
		console.log(parseInt(ta[0]), parseInt(tb[0]));
		console.log(parseInt(ta), parseInt(tb));
		*/

		let r = parseInt(ta[0]) - parseInt(tb[0]);

		//cache.a = a;
		//cache.b = b;

		if (r !== 0)
		{
			//console.log(cache);
			return r;
		}

		//console.log(cache);
		//console.log(ta.input.localeCompare(tb.input));

		//console.log(cache);
		//cache.as = cache.as || a;
		//cache.bs = cache.bs || b;

		let a1 = ta.input.slice(ta[0].length);
		let b1 = tb.input.slice(tb[0].length);

		//while (a1[0] == b1[0] && (b1[0] == '_'))
		while (a1 != b1 && a1[0] && a1[0] == b1[0] && (!/^\d$/.test(b1[0])))
		{
			a1 = a1.slice(1);
			b1 = b1.slice(1);
		}

		return defaultSortCallback(a1, b1, cache);
	}

	//return (a > b) ? 1 : 0;
	return naturalCompare(a, b);
}

function _trim(input: string): string
{
	return input
		.replace(/^[_\s]+(\d+)/, '$1')
		.replace(/^\D(\d+)/, '$1')
		.trim()
	;
}

import * as self from './sort';
export default self;
//export default exports;
