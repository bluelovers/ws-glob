
import { globToTree, treeToGlob } from '../core';
import { sort } from '@lazy-glob/sort-entries';
import naturalCompare from '@bluelovers/string-natural-compare/core';

let data = `00020_1章.txt
00020_2章/
00020_3章/
00020_3章/3章 9話/3章 9話file.txt
00020_3章/3章 8話.txt
00020_3章/3章 10話.txt
00020_3章/3章 11話.txt
00020_3章/3章 12話.txt
00020_3章/3章 13話.txt
00020_3章/3章 15話.txt
00020_3章/3章 14話.txt
00020_3章/3章 15.5話 特別閑話.txt
00020_3章/3章 16話.txt
00020_3章/3章 17話.txt`.split("\n");

test(`globToTree / treeToGlob`, () =>
{
	let t = globToTree(data);

	let actual = sort(t, function (a, b, cache)
	{
		return naturalCompare(_c(a, cache), _c(b, cache));
	});

	expect(t).toMatchSnapshot();
	expect(actual).toMatchSnapshot();
	expect(treeToGlob(actual)).toMatchSnapshot();

});

function _c(k, cache): string
{
	if (k in cache)
	{
		return cache[k];
	}

	cache[k] = k
		.replace(/\D+$/, '')
	;

//	console.log(k, cache[k]);

	return cache[k];
}
