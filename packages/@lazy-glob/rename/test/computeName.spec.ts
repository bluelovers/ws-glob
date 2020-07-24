import { computeName } from '../lib/util/computeName';

describe('When parameters of invalid type are passed', function ()
{
	describe('renamer.computeName(names, srcGlob, dstGlob)', function ()
	{
		it('should throw a TypeError', function ()
		{
			// @ts-ignore
			expect(() => computeName({}, '*.txt', '*.out')).toThrowErrorMatchingSnapshot();

			// @ts-ignore
			expect(() => computeName(1, '*.txt', '*.out')).toThrowErrorMatchingSnapshot();

			// @ts-ignore
			expect(() => computeName(['bob-smith'], [], '???-*')).toThrowErrorMatchingSnapshot();

			// @ts-ignore
			expect(() => computeName('bob-smith', '*-???', 0)).toThrowErrorMatchingSnapshot();

			// @ts-ignore
			expect(() => computeName(['bob-smith'], '', {})).toThrowErrorMatchingSnapshot();

			expect(() => computeName(['bob-smith'], '???-*', '')).toThrowErrorMatchingSnapshot();

			// @ts-ignore
			expect(() => computeName('bob-smith', 1, '')).toThrowErrorMatchingSnapshot();

			expect(() => computeName([], '*', '*')).toThrowErrorMatchingSnapshot();

		});
	});
});

/*
            Source glob doesn't match
 */
describe('When source glob does not match anything', function ()
{
	describe('computeName(names, srcGlob, dstGlob)', function ()
	{
		it('should return empty string as result', function ()
		{
			let result = computeName(['alx-rose.red', '_1234'], '*.????', '*');
			expect(result[0]).toHaveLength(0);
			expect(result[1]).toHaveLength(0);

			result = computeName('^$', '?', '?');
			expect(result[0]).toHaveLength(0);
			result = computeName('.', '**??', '*?');
			expect(result[0]).toHaveLength(0);
			result = computeName('123.456', '*_*', '*');
			expect(result[0]).toHaveLength(0);
			result = computeName('^abc$', '???b??*', '???');
			expect(result[0]).toHaveLength(0);
			result = computeName('1234', '123', '6789');
			expect(result[0]).toHaveLength(0);
			result = computeName('1234', '12345', '6789');
			expect(result[0]).toHaveLength(0);
			result = computeName('1234', '*2**5', '**6789');
			expect(result[0]).toHaveLength(0);
			result = computeName('1234', '12?45', '?6789');
			expect(result[0]).toHaveLength(0);
		});
	});
});

/*
            # of wildcards in SG < in DG
 */
describe('When number of given wildcard in destination glob is higher than in source glob', function ()
{
	describe('computeName(names, srcGlob, dstGlob)', function ()
	{

		it('should throw an Error', function ()
		{
			/************ # of ? in SG < in DG ************/

			[
				[
					'alx-rose.red', '*', '*?'
				],
				[
					'^$', '??', '???'
				],
				[
					'^bruce.wayne$', '*?*', '??'
				],
				[
					'^bruce.wayne$', '*.wayne?', '??'
				],
				[
					'uvwxyz', 'uvwxyz', '123456?'
				],
			].forEach((argv) => {
				// @ts-ignore
				expect(() => computeName(...argv)).toThrowErrorMatchingSnapshot();
			});





			/************ # of * in SG < in DG ************/

			[
				[
					'.', '*', '*.*'
				],
				[
					'.', '?', '?*'
				],
				[
					// ** is src glob counts as * ; but ** in dst glob remains unchanged
					'abc', '**', '**'
				],
				[
					// ***b* -> *b* in src glob; but *** in dst glob remains unchanged
					'abc', '***b*', '***'
				],
				[
					'abc', '*ab**', '***'
				],
				[
					'uvwxyz', 'uvwxyz', '123456*'
				],
			].forEach((argv) => {
				// @ts-ignore
				expect(() => computeName(...argv)).toThrowErrorMatchingSnapshot();
			});

		});
	});
});

/*
            # wildcard in SG >= in DG
 */
describe('When number of given wildcard in destination glob is equal or fewer than in source glob', function ()
{
	describe('computeName(names, srcGlob, dstGlob)', function ()
	{
		it('should return computed new name', function ()
		{
			/************ # of ? in SG >= in DG ************/
			let result = computeName('alx-rose.red', '*?', '?onald');
			expect(result[0]).toBe('donald');
			result = computeName('.', '*?*', '?');
			expect(result[0]).toBe('.');
			result = computeName('abcdef', '*??*', '?');
			expect(result[0]).toBe('e');
			result = computeName('^$', '?*?', '??');
			expect(result[0]).toBe('^$');
			result = computeName('^abc$', '?abc?', '?123?');
			expect(result[0]).toBe('^123$');
			result = computeName('^abc$', '**??b??*', '???');
			expect(result[0]).toBe('^ac');
			result = computeName('^abc$', '*??b??*', '?*?*?');
			expect(result[0]).toBe('^ac');
			result = computeName('.', '?**', '?');
			expect(result[0]).toBe('.');

			/************ # of * in SG >= in DG ************/
			result = computeName('.', '*?', '?*');
			expect(result[0]).toBe('.');
			result = computeName(['.'], '*?', '*');
			expect(result[0]).toBe('');
			result = computeName('123456', '*?*', '**?');
			expect(result[0]).toBe('123456');
			result = computeName('abc', '*a*b*c*', '***');
			expect(result[0]).toBe('');
			result = computeName(['abcdef', '123bf4'], '**b**f**', '***');
			expect(result[0]).toBe('acde');
			expect(result[1]).toBe('1234');

			/*********** cases with wildcards in path **********/
			result = computeName('test/test-data/123.doc', '*t/?es?-**/*.???*', 'test/*?-*2/????.**');
			expect(result[0]).toBe('test/test-data2/tdoc.123');
		});
	});
});

/*
            When source glob is a literal
 */
describe('When source glob is a literal', function ()
{
	describe('computeName(names, srcGlob, dstGlob)', function ()
	{
		it('should return literally the dst glob, only if it does not contain any wildcard', function ()
		{
			let result = computeName('uvwxyz', 'uvwxyz', '123456');
			expect(result[0]).toBe('123456');

			// but should return empty string if src glob does not match
			result = computeName('uvwxyz', 'uvwxy', '12345');
			expect(result[0]).toHaveLength(0);
		});
	});
});

/*
            When destination glob is a literal
 */
describe('When destination glob is a literal', function ()
{
	describe('computeName(names, srcGlob, dstGlob)', function ()
	{
		it('should return a literally the dst glob, the source glob matches', function ()
		{
			let result = computeName('uvwxyz', '*', '123456');
			expect(result[0]).toBe('123456');
			result = computeName('uvwxyz', 'abc', '123456');
			expect(result[0]).toHaveLength(0);
			result = computeName('uvwxyz', '???', '123456');
			expect(result[0]).toHaveLength(0);
			result = computeName('uvwxyz', '*u', '123456');
			expect(result[0]).toHaveLength(0);
			result = computeName('uvwxyz', '*z', '123456');
			expect(result[0]).toBe('123456');
		});
	});
});

/*
            When names is an array of string
 */
describe('When names is an array of string', function ()
{
	describe('computeName(names, srcGlob, dstGlob)', function ()
	{
		it('should return an array of new names', function ()
		{
			let result = computeName(['abcde', '1234', '!@#$%^&'], '*', 'uvwxyz');
			expect(result.length).toBe(3);
			expect(result[0]).toBe('uvwxyz');
			expect(result[1]).toBe('uvwxyz');
			expect(result[2]).toBe('uvwxyz');
			result = computeName(['abcde', '1234', '!@#$%^&'], '*', '*');
			expect(result.length).toBe(3);
			expect(result[0]).toBe('abcde');
			expect(result[1]).toBe('1234');
			expect(result[2]).toBe('!@#$%^&');
			result = computeName(['abcde', '1234', '!@#$%^&'], '???', '123???');
			expect(result.length).toBe(3);
			expect(result[0]).toHaveLength(0);
			expect(result[1]).toHaveLength(0);
			expect(result[2]).toHaveLength(0);
			result = computeName(['abcde', '1234', '!@#$%^&'], '*????', '*');
			expect(result.length).toBe(3);
			expect(result[0]).toBe('a');
			expect(result[1]).toBe('');
			expect(result[2]).toBe('!@#');
			result = computeName(['abcde', '1234', '!@#$%^&'], '???????', '???????');
			expect(result.length).toBe(3);
			expect(result[0]).toHaveLength(0);
			expect(result[1]).toHaveLength(0);
			expect(result[2]).toBe('!@#$%^&');
			result = computeName(['abcde', '1234', '!@#$%^&'], '!@#$%^&', 'xyz');
			expect(result.length).toBe(3);
			expect(result[0]).toHaveLength(0);
			expect(result[1]).toHaveLength(0);
			expect(result[2]).toBe('xyz');
			result = computeName(['123', '5637', '893', 'abc'], '??3', '?-?');
			expect(result.length).toBe(4);
			expect(result[0]).toBe('1-2');
			expect(result[1]).toHaveLength(0);
			expect(result[2]).toBe('8-9');
			expect(result[3]).toHaveLength(0);
			result = computeName(['123', '5637', '3', 'a3cd'], '??3*', '?-?-*');
			expect(result.length).toBe(4);
			expect(result[0]).toBe('1-2-');
			expect(result[1]).toBe('5-6-7');
			expect(result[2]).toHaveLength(0);
			expect(result[3]).toHaveLength(0);
		});
	});
});

/*
            When "names" is a string
 */
describe('When string is passed in "names" argument', function ()
{
	describe('computeName(names, srcGlob, dstGlob)', function ()
	{
		it('should return a result array with a single element', function ()
		{
			let result = computeName('axl-rose', '*', '*');
			expect(result.length).toBe(1);
			expect(result[0]).toBe('axl-rose');

			result = computeName('', '?', '?');
			expect(result.length).toBe(1);
			expect(result[0]).toHaveLength(0);
		});
	});
});
