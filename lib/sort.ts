/**
 * Created by user on 2018/2/12/012.
 */

import * as naturalCompare from 'string-natural-compare';

export { naturalCompare }

export function defaultSortCallback(a, b, cache = {})
{
	let r = /^(\d+)/;
	let ta: RegExpExecArray;
	let tb: RegExpExecArray;

	if ((ta = r.exec(_trim(a))) && (tb = r.exec(_trim(b))))
	{
		/*
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

		return defaultSortCallback(ta.input.slice(ta[0].length), tb.input.slice(tb[0].length), cache);
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
