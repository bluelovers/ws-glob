/**
 * Created by user on 2018/2/14/014.
 */

import * as StrUtil from 'str-util';
import NovelTextFile from 'novel-text/zhjp';
import { cn2tw } from 'chinese_convert';

export function normalize_val(str: string, padNum: number = 4): string
{
	str = NovelTextFile.filename(str);

	str = StrUtil.toHalfWidth(str);
	str = StrUtil.trim(str, '　');

	str = StrUtil.zh2num(str, {
		truncateOne: 2,
	}).toString();

	str = str.replace(/\d+/g, function ($0)
	{
		return $0.padStart(padNum, '0');
	});

	str = str
		.replace(/\./g, '_')
		.replace(/[―—一－──\-]/g, '_')
		.replace(/\s/g, '_')
		.replace(/_+/g, '_')
	;

	str = StrUtil.zh2jp(cn2tw(str) as string, {
		safe: false,
	});

	return str;
}

import * as self from './helper';
export default self;
