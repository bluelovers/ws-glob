/**
 * Created by user on 2018/2/14/014.
 */

import * as StrUtil from 'str-util';
import NovelTextFile from 'novel-text/zhjp';
import { cn2tw } from 'chinese_convert';
import { convertRoman } from 'arabic-roman-convert.js';
import * as deromanize from 'deromanize';
import { IOptions } from './index';

export { deromanize }

export function normalize_val(str: string, padNum: number = 5, options: IOptions = {}): string
{
	padNum = padNum || options.padNum;

	str = NovelTextFile.filename(str);

	if (/^(?:序|プロローグ|Prologue)/i.test(str))
	{
		str = '0_' + str;
	}

	str = str.replace(/^(web)版(\d+)/i, '$1$2');

	str = StrUtil.toHalfWidth(str)
		.toLowerCase()
	;
	str = StrUtil.trim(str, '　');

	str = StrUtil.zh2num(str);

	str = StrUtil.zh2num(str, {
		truncateOne: 2,
		flags: 'ug',
	}).toString();

	//console.log(str);

	if (options.checkRoman)
	{
		let m = isRoman(str);

		if (m)
		{
			let n = deromanize(normalizeRoman(m[1]));
			str = n.toString() + str.slice(m[1].length);
			//console.log(m[1], n, str);
		}
	}

	str = circle2num(str);

	str = str.replace(/\d+/g, function ($0)
	{
		return $0.padStart(padNum, '0');
	});

	str = str
		.replace(/^第+/, '')
		//.replace(/\./g, '_')
		.replace(/[―—－──\-―—─＝=]/g, '_')
		.replace(/[\s　]/g, '_')
		.replace(/[\(\)〔［【《（「『』」》）】〕］]/g, '_')
		.replace(/[·‧・···•]/g, '_')
		.replace(/[：：︰﹕：]/ug, '_')
		.replace(/[・:,]/g, '_')
		.replace(/_+/g, '_')
	;

	str = StrUtil.zh2jp(cn2tw(str) as string, {
		safe: false,
	});

	return str;
}

export function isRoman(str)
{
	return /^([LCDMIVX\u2160-\u217f]+)(?![a-z\d])/ui.exec(str);
}

export function normalizeRoman(input: string, bool?: boolean)
{
	let ro = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII',];

	for (let i = 0; i < 12; i++)
	{
		let r = new RegExp(String.fromCharCode(0x2160 + i) + '|' + String.fromCharCode(0x2160 + 16 + i), 'g');
		input = input.replace(r, bool ? String.fromCharCode(0x2160 + i) : ro[i]);
	}

	return input;
}

/**
 * @see http://xahlee.info/comp/unicode_circled_numbers.html
 *
 * @param str
 * @returns {string}
 *
 * @todo add more
 */
export function circle2num(str): string
{
	str = str
		.replace(new RegExp(String.fromCharCode(9450), 'g'), '0')
	;

	for (let n = 1; n<= 20; n++)
	{
		str = str
			.replace(new RegExp(String.fromCharCode(9312 + n - 1), 'g'), n)
		;
	}

	for (let n = 21; n<= 35; n++)
	{
		str = str
			.replace(new RegExp(String.fromCharCode(12881 + n - 21), 'g'), n)
		;
	}

	for (let n = 36; n<= 50; n++)
	{
		str = str
			.replace(new RegExp(String.fromCharCode(12977 + n - 36), 'g'), n)
		;
	}

	//-------------

	for (let n = 1; n<= 10; n++)
	{
		str = str
			.replace(new RegExp(String.fromCharCode(0x24ea + n - 1), 'g'), n)
		;
	}

	//-------------

	str = str
		.replace(new RegExp(String.fromCharCode(0x24ff), 'g'), '0')
	;

	for (let n = 1; n<= 10; n++)
	{
		str = str
			.replace(new RegExp(String.fromCharCode(0x2776 + n - 1), 'g'), n)
		;
	}

	//-------------

	for (let n = 1; n<= 10; n++)
	{
		str = str
			.replace(new RegExp(String.fromCharCode(0x278a + n - 1), 'g'), n)
		;
	}

	for (let n = 11; n<= 20; n++)
	{
		str = str
			.replace(new RegExp(String.fromCharCode(0x24eb + n - 1), 'g'), n)
		;
	}

	//-------------

	for (let n = 1; n<= 10; n++)
	{
		str = str
			.replace(new RegExp(String.fromCharCode(0x24f5 + n - 1), 'g'), n)
		;
	}

	return str;
}

import * as self from './helper';
export default self;
