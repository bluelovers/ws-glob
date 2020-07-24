/*
 * ----------------------------------------------------------------------------------------------------
 * ------------------------------- Argument Handling Test Cases for capture() -------------------------
 * ----------------------------------------------------------------------------------------------------
 */
import { capture } from '../lib/util/capture';
import { deconstruct } from '../lib/util/deconstruct';

describe('When receiving multiple names', function ()
{
	describe('capture()', function ()
	{
		it('should return a number of results matching number of names received', function ()
		{
			let result = capture(['marge.json', 'barney.txt'], '*.t?t');
			expect(result.length).toBe(2);

			result = capture(['marge.json', 'barney.txt', 'maggie.doc'], '?.js');
			expect(result.length).toBe(3);

			result = capture(['bart.bar', 'lisa', 'maggie.', 'mr.burns'], '*');
			expect(result.length).toBe(4);
		});
	});
});

describe('When array of names is empty', function ()
{
	describe('capture()', function ()
	{
		it('should return null', function ()
		{
			let result = capture([], '*.ex?');
			expect(result).toBeNull();
		});
	});
});

describe('When first argument is not an array', function ()
{
	describe('capture()', function ()
	{
		it('should return null', function ()
		{
			// @ts-ignore
			let result = capture('bob', '*.js');
			expect(result).toBeNull();
			// @ts-ignore
			result = capture('', '*');
			expect(result).toBeNull();

			// @ts-ignore
			result = capture(10, '*.txt');
			expect(result).toBeNull();

			// @ts-ignore
			result = capture({}, '*.js');
			expect(result).toBeNull();

			// @ts-ignore
			result = capture();
			expect(result).toBeNull();
		});
	});
});

describe('When receiving anything other than non-empty string as 2nd argument', function ()
{
	describe('capture()', function ()
	{
		it('should return null', function ()
		{
			// @ts-ignore
			let result = capture(['bob'], 2);
			expect(result).toBeNull();

			result = capture(['bob'], '');
			expect(result).toBeNull();

			// @ts-ignore
			result = capture(['bob'], []);
			expect(result).toBeNull();

			// @ts-ignore
			result = capture(['bob'], {});
			expect(result).toBeNull();

			// @ts-ignore
			result = capture(['bob']);
			expect(result).toBeNull();
		});
	});
});
/*
 * ----------------------------------------------------------------------------------
 * ------------------------- Test cases for * wildcard ------------------------------
 * ----------------------------------------------------------------------------------
 */
describe('When * wildcard matches multiple characters', function ()
{
	describe('capture()[x].getGroups()', function ()
	{
		it('should return an array of {type: "wildcard", pattern: "*", match: <matched_str>}', function ()
		{
			let result = capture(['homer.js'], '*.js');
			expect(result[0].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '*', match: 'homer' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], 'homer*');
			expect(result[0].getGroups()[1]).toEqual({ type: 'wildcard', pattern: '*', match: '.js' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], 'h*s');
			expect(result[0].getGroups()[1]).toEqual({ type: 'wildcard', pattern: '*', match: 'omer.j' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['lisa', 'maggie.', 'x'], '*');
			expect(result[0].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '*', match: 'lisa' });
			expect(result[1].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '*', match: 'maggie.' });
			expect(result[2].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '*', match: 'x' });
			expect(result[0].hasMatch()).toBe(true);
			expect(result[1].hasMatch()).toBe(true);
			expect(result[2].hasMatch()).toBe(true);
		});
	});
});

describe('When * wildcard matches a single character', function ()
{
	describe('capture()[x].getGroups()', function ()
	{
		it('should return an array of {type: "wildcard", pattern: "*", match: <matched_char>}', function ()
		{
			let result = capture(['homer.js'], '*omer.js');
			expect(result[0].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '*', match: 'h' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], 'homer*js');
			expect(result[0].getGroups()[1]).toEqual({ type: 'wildcard', pattern: '*', match: '.' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], 'homer.j*');
			expect(result[0].getGroups()[1]).toEqual({ type: 'wildcard', pattern: '*', match: 's' });
			expect(result[0].hasMatch()).toBe(true);
		});
	});
});

describe('When * wildcard matches no character', function ()
{
	describe('capture()[x].getGroups()', function ()
	{
		it('should return an array of {type: "wildcard", pattern: "*", match: ""} because * matches zero or more characters', function ()
		{
			let result = capture(['homer.js'], '*homer.js');
			expect(result[0].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '*', match: '' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], 'homer*.js');
			expect(result[0].getGroups()[1]).toEqual({ type: 'wildcard', pattern: '*', match: '' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], 'homer.js*');
			expect(result[0].getGroups()[1]).toEqual({ type: 'wildcard', pattern: '*', match: '' });
			expect(result[0].hasMatch()).toBe(true);
		});
	});
});

describe('When ** is specified', function ()
{
	describe('capture()', function ()
	{
		it('should treat ** like *, e.g. {type: "wildcard", pattern: "*", match: <matched_str>}', function ()
		{
			let result = capture(['homer.js'], '**.js');
			expect(result[0].getGroups().length).toBe(2);
			expect(result[0].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '*', match: 'homer' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], 'homer**js');
			expect(result[0].getGroups().length).toBe(3);
			expect(result[0].getGroups()[1]).toEqual({ type: 'wildcard', pattern: '*', match: '.' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], 'homer?js**');
			expect(result[0].getGroups().length).toBe(4);
			expect(result[0].getGroups()[3]).toEqual({ type: 'wildcard', pattern: '*', match: '' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['abcdef', '123bf4'], '**b**f***');
			expect(result.length).toBe(2);
			expect(result[0].hasMatch()).toBe(true);
			expect(result[0].getGroups().length).toBe(5);
			expect(result[0].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '*', match: 'a' });
			expect(result[0].getGroups()[1]).toEqual({ type: 'literal', pattern: 'b', match: 'b' });
			expect(result[0].getGroups()[2]).toEqual({ type: 'wildcard', pattern: '*', match: 'cde' });
			expect(result[0].getGroups()[3]).toEqual({ type: 'literal', pattern: 'f', match: 'f' });
			expect(result[0].getGroups()[4]).toEqual({ type: 'wildcard', pattern: '*', match: '' });
			expect(result[1].hasMatch()).toBe(true);
			expect(result[1].getGroups().length).toBe(5);
			expect(result[1].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '*', match: '123' });
			expect(result[1].getGroups()[1]).toEqual({ type: 'literal', pattern: 'b', match: 'b' });
			expect(result[1].getGroups()[2]).toEqual({ type: 'wildcard', pattern: '*', match: '' });
			expect(result[1].getGroups()[3]).toEqual({ type: 'literal', pattern: 'f', match: 'f' });
			expect(result[1].getGroups()[4]).toEqual({ type: 'wildcard', pattern: '*', match: '4' });
		});
	});
});

describe('When * wildcard is used in glob pattern', function ()
{
	describe('capture()[x].getAsterisk()', function ()
	{
		it('should return { type, pattern, match } with pattern="*" for every instances of *', function ()
		{
			let result = capture(['homersimpsons.txt'], '*hom??*m*.?**?');
			expect(result[0].getAsterisk()[0]).toEqual({ type: 'wildcard', pattern: '*', match: '' });
			expect(result[0].getAsterisk()[1]).toEqual({ type: 'wildcard', pattern: '*', match: 'si' });
			expect(result[0].getAsterisk()[2]).toEqual({ type: 'wildcard', pattern: '*', match: 'psons' });
			expect(result[0].getAsterisk()[3]).toEqual({ type: 'wildcard', pattern: '*', match: 'x' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture([''], '***');
			expect(result[0].getAsterisk().length).toBe(1);
			expect(result[0].getAsterisk()[0]).toEqual({ type: 'wildcard', pattern: '*', match: '' });
			expect(result[0].hasMatch()).toBe(true);
		});

		it('should return empty array if glob does not match', function ()
		{
			let result = capture(['Bomersimpsons.txt'], '*hom??*m*.?**?');
			expect(result[0].getAsterisk()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);
		});

		it('should return empty array if no * wildcard used', function ()
		{
			let result = capture(['homer.txt'], 'homer.???');
			expect(result[0].getAsterisk()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(true);
		});

		it('should return empty array when invalid names used for capture()', function ()
		{
			// @ts-ignore
			let result = capture([11], '*');
			expect(result.length).toBe(1);
			expect(result[0].getAsterisk()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			// @ts-ignore
			result = capture([{}, 'bob'], '**');
			expect(result.length).toBe(2);
			expect(result[0].getAsterisk()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);
			expect(result[1].hasMatch()).toBe(true);
			expect(result[1].getAsterisk()).not.toHaveLength(0);
		});
	});
});

/*
 * ------------------------------------------------------------------------------
 * ------------------- Tests cases for ? wildcard -------------------------------
 * ------------------------------------------------------------------------------
 */
describe('When ? wildcard matches one character', function ()
{
	describe('capture()[x].getGroups', function ()
	{
		it('should return an array of {type: "wildcard", pattern: "?", match: <matched_char>}', function ()
		{
			let result = capture(['homer.js'], '?omer.js');
			expect(result[0].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '?', match: 'h' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], 'homer?js');
			expect(result[0].getGroups()[1]).toEqual({ type: 'wildcard', pattern: '?', match: '.' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], 'homer.j?');
			expect(result[0].getGroups()[1]).toEqual({ type: 'wildcard', pattern: '?', match: 's' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['.', 'x'], '?');
			expect(result[0].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '?', match: '.' });
			expect(result[1].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '?', match: 'x' });
			expect(result[0].hasMatch()).toBe(true);
			expect(result[1].hasMatch()).toBe(true);
		});
	});
});

describe('When ? wildcard matches no character', function ()
{
	describe('capture()[x].getGroups()', function ()
	{
		it('should return empty array (i.e. no match)', function ()
		{
			let result = capture(['homer.js'], '?homer.js');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], 'homer.js?');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], 'homer?.js');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['bart'], '?????');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);
		});
	});
});

describe('When ? wildcards do not match enough characters', function ()
{
	describe('capture()[x].getGroups()', function ()
	{
		it('should return empty array (i.e. no match)', function ()
		{
			let result = capture(['barney.beer'], '?');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer'], '???');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);
		});
	});
});

describe('When multiple ? wildcards are used', function ()
{
	describe('capture()[x].getGroups()', function ()
	{
		it('should return empty array (i.e. no match), if one or more ? have no match', function ()
		{
			let result = capture(['homer.js'], '??omer.js');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], 'homer.j??');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], 'home??.js');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], '??????????');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], '??homer?js');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], '??mer.js??');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);
		});

		it('should return in an array of {type: "wildcard", pattern: "?", match: <matched_char>} for each ?, if all of them have a match', function ()
		{
			let result = capture(['homer.js'], 'ho?er?js');
			expect(result[0].getGroups()[1]).toEqual({ type: 'wildcard', pattern: '?', match: 'm' });
			expect(result[0].getGroups()[3]).toEqual({ type: 'wildcard', pattern: '?', match: '.' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], 'h??e???s');
			expect(result[0].getGroups()[1]).toEqual({ type: 'wildcard', pattern: '?', match: 'o' });
			expect(result[0].getGroups()[2]).toEqual({ type: 'wildcard', pattern: '?', match: 'm' });
			expect(result[0].getGroups()[4]).toEqual({ type: 'wildcard', pattern: '?', match: 'r' });
			expect(result[0].getGroups()[5]).toEqual({ type: 'wildcard', pattern: '?', match: '.' });
			expect(result[0].getGroups()[6]).toEqual({ type: 'wildcard', pattern: '?', match: 'j' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], '????????');
			expect(result[0].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '?', match: 'h' });
			expect(result[0].getGroups()[1]).toEqual({ type: 'wildcard', pattern: '?', match: 'o' });
			expect(result[0].getGroups()[2]).toEqual({ type: 'wildcard', pattern: '?', match: 'm' });
			expect(result[0].getGroups()[3]).toEqual({ type: 'wildcard', pattern: '?', match: 'e' });
			expect(result[0].getGroups()[4]).toEqual({ type: 'wildcard', pattern: '?', match: 'r' });
			expect(result[0].getGroups()[5]).toEqual({ type: 'wildcard', pattern: '?', match: '.' });
			expect(result[0].getGroups()[6]).toEqual({ type: 'wildcard', pattern: '?', match: 'j' });
			expect(result[0].getGroups()[7]).toEqual({ type: 'wildcard', pattern: '?', match: 's' });
			expect(result[0].hasMatch()).toBe(true);
		});
	});
});

describe('When ? wildcard is used in glob pattern', function ()
{
	describe('capture()[x].getQuestionMark()', function ()
	{
		it('should return { type, pattern, match } with pattern="?" for every instances of ?', function ()
		{
			let result = capture(['homersimpsons.tx$'], '*hom??*m*.?**?');
			expect(result[0].getQuestionMark()[0]).toEqual({ type: 'wildcard', pattern: '?', match: 'e' });
			expect(result[0].getQuestionMark()[1]).toEqual({ type: 'wildcard', pattern: '?', match: 'r' });
			expect(result[0].getQuestionMark()[2]).toEqual({ type: 'wildcard', pattern: '?', match: 't' });
			expect(result[0].getQuestionMark()[3]).toEqual({ type: 'wildcard', pattern: '?', match: '$' });
			expect(result[0].hasMatch()).toBe(true);
		});

		it('should return empty array if glob does not match', function ()
		{
			let result = capture(['Bomersimpsons.txt'], '*hom??*m*.?**?');
			expect(result[0].getQuestionMark()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture([''], '?');
			expect(result[0].getQuestionMark()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['^omer$'], '???????');
			expect(result[0].getQuestionMark()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);
		});

		it('should return empty array if no ? wildcard used', function ()
		{
			let result = capture(['homer.txt'], 'homer.*');
			expect(result[0].getQuestionMark()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(true);
		});

		it('should return empty array when invalid names used for capture()', function ()
		{
			// @ts-ignore
			let result = capture([11], '?');
			expect(result.length).toBe(1);
			expect(result[0].getQuestionMark()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			// @ts-ignore
			result = capture([{}, 'bob'], '???');
			expect(result.length).toBe(2);
			expect(result[0].getQuestionMark()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);
			expect(result[1].hasMatch()).toBe(true);
			expect(result[1].getQuestionMark()).not.toHaveLength(0);
		});
	});
});

/*
 * --------------------------------------------------------------------------------------
 * ------------------------------- Test cases for literals ------------------------------
 * --------------------------------------------------------------------------------------
 */
describe('When the literal part is matched', function ()
{
	describe('capture()[x].getGroups()', function ()
	{
		it('should return in an array of {type: "literal", pattern: <literal_str>, match: <matched_str>}', function ()
		{
			let result = capture(['homer.js'], 'homer.js');
			expect(result[0].getGroups()[0]).toEqual({ type: 'literal', pattern: 'homer.js', match: 'homer.js' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer..js'], 'homer..js');
			expect(result[0].getGroups()[0]).toEqual({ type: 'literal', pattern: 'homer..js', match: 'homer..js' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], '*.js');
			expect(result[0].getGroups()[1]).toEqual({ type: 'literal', pattern: '.js', match: '.js' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], 'h**');
			expect(result[0].getGroups()[0]).toEqual({ type: 'literal', pattern: 'h', match: 'h' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], '*o*');
			expect(result[0].getGroups()[1]).toEqual({ type: 'literal', pattern: 'o', match: 'o' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], '?omer.??');
			expect(result[0].getGroups()[1]).toEqual({ type: 'literal', pattern: 'omer.', match: 'omer.' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['a', 'a'], 'a');
			expect(result[0].getGroups()[0]).toEqual({ type: 'literal', pattern: 'a', match: 'a' });
			expect(result[1].getGroups()[0]).toEqual({ type: 'literal', pattern: 'a', match: 'a' });
			expect(result[0].hasMatch()).toBe(true);
			expect(result[1].hasMatch()).toBe(true);

			result = capture(['pop(tarts)TXT', ')Tpop(tarts'], 'pop(tarts)TXT');
			expect(result.length).toBe(2);
			expect(result[0].hasMatch()).toBe(true);
			expect(result[0].getGroups().length).toBe(1);
			expect(result[0].getGroups()[0]).toEqual({ type: 'literal', pattern: 'pop(tarts)TXT', match: 'pop(tarts)TXT' });

			result = capture([')whe(re(is)my)sweet()(pop((tarts))TXT'], ')whe(re(is)my)sweet()(pop((tarts))TXT');
			expect(result.length).toBe(1);
			expect(result[0].hasMatch()).toBe(true);
			expect(result[0].getGroups().length).toBe(1);
			expect(result[0].getGroups()[0]).toEqual(
				{
					type: 'literal',
					pattern: ')whe(re(is)my)sweet()(pop((tarts))TXT',
					match: ')whe(re(is)my)sweet()(pop((tarts))TXT',
				},
			);

			// Glob: contains\\\\backward\\slashes\\ (equals code 'contains\\\\\\\\backward\\\\slashes\\\\') should match contains\\backward\slashes\
			result = capture(['contains\\\\backward\\slashes\\'], 'contains\\\\\\\\backward\\\\slashes\\\\');

			console.dir(result)

			expect(result.length).toBe(1);
			expect(result[0].hasMatch()).toBe(true);
			expect(result[0].getGroups().length).toBe(1);
			expect(result[0].getGroups()[0]).toEqual(
				{
					type: 'literal',
					pattern: 'contains\\\\\\\\backward\\\\slashes\\\\',
					match: 'contains\\\\backward\\slashes\\',
				},
			);

			result = capture([')mix\\(of)\\\\parens(and\\\\)sla(she(\\s)\\)'], ')mix\\\\(of)\\\\\\\\parens(and\\\\\\\\)sla(she(\\\\s)\\\\)');

			console.dir(result)

			expect(result.length).toBe(1);
			expect(result[0].hasMatch()).toBe(true);
			expect(result[0].getGroups().length).toBe(1);
			expect(result[0].getGroups()[0]).toEqual(
				{
					type: 'literal',
					pattern: ')mix\\\\(of)\\\\\\\\parens(and\\\\\\\\)sla(she(\\\\s)\\\\)',
					match: ')mix\\(of)\\\\parens(and\\\\)sla(she(\\s)\\)',
				},
			);
		});
	});
});

describe('When the literal part has no match', function ()
{
	describe('capture()[x].getGroups()', function ()
	{
		it('should return an empty array', function ()
		{
			let result = capture(['homer.js'], 'homar.js');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], '*.j');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], 'o*');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], '*a*');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], '*.');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], '?omar.??');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], '?i*');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], 'homer');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['pop(tarts)TXT', ')Tpop(tarts'], 'pop(tarts)TXT');
			expect(result.length).toBe(2);
			expect(result[1].getGroups()).toHaveLength(0);
			expect(result[1].hasMatch()).toBe(false);
		});
	});
});

describe('When multiple literal parts matched', function ()
{
	describe('capture()[x].getGroups()', function ()
	{
		it('should return in an array of {type: "literal", pattern: <literal_str>, match: <matched_str>} for each literal match', function ()
		{
			let result = capture(['homer.js'], 'h*s');
			expect(result[0].getGroups()[0]).toEqual({ type: 'literal', pattern: 'h', match: 'h' });
			expect(result[0].getGroups()[2]).toEqual({ type: 'literal', pattern: 's', match: 's' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], 'home**js');
			expect(result[0].getGroups()[0]).toEqual({ type: 'literal', pattern: 'home', match: 'home' });
			expect(result[0].getGroups()[2]).toEqual({ type: 'literal', pattern: 'js', match: 'js' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], 'homer?js');
			expect(result[0].getGroups()[0]).toEqual({ type: 'literal', pattern: 'homer', match: 'homer' });
			expect(result[0].getGroups()[2]).toEqual({ type: 'literal', pattern: 'js', match: 'js' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], 'ho?e??js');
			expect(result[0].getGroups()[0]).toEqual({ type: 'literal', pattern: 'ho', match: 'ho' });
			expect(result[0].getGroups()[2]).toEqual({ type: 'literal', pattern: 'e', match: 'e' });
			expect(result[0].getGroups()[5]).toEqual({ type: 'literal', pattern: 'js', match: 'js' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], '*ho?e*?s');
			expect(result[0].getGroups()[1]).toEqual({ type: 'literal', pattern: 'ho', match: 'ho' });
			expect(result[0].getGroups()[3]).toEqual({ type: 'literal', pattern: 'e', match: 'e' });
			expect(result[0].getGroups()[6]).toEqual({ type: 'literal', pattern: 's', match: 's' });
			expect(result[0].hasMatch()).toBe(true);
		});
	});
});

describe('When literal parts contain "^" and "$" characters', function ()
{
	describe('capture()[x].getGroups()', function ()
	{
		it('should return in an array of {type: "literal", pattern: <literal_str>, match: <matched_str>} for each literal match)', function ()
		{
			let result = capture(['homer^.js'], 'homer^.js');
			expect(result[0].getGroups()[0]).toEqual({ type: 'literal', pattern: 'homer^.js', match: 'homer^.js' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.$js'], 'homer.$js');
			expect(result[0].getGroups()[0]).toEqual({ type: 'literal', pattern: 'homer.$js', match: 'homer.$js' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['^homer.js'], '^homer.js');
			expect(result[0].getGroups()[0]).toEqual({ type: 'literal', pattern: '^homer.js', match: '^homer.js' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.as$'], 'homer.as$');
			expect(result[0].getGroups()[0]).toEqual({ type: 'literal', pattern: 'homer.as$', match: 'homer.as$' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['^homer.as$'], '^homer.as$');
			expect(result[0].getGroups()[0]).toEqual({ type: 'literal', pattern: '^homer.as$', match: '^homer.as$' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['$homer.as^'], '$homer.as^');
			expect(result[0].getGroups()[0]).toEqual({ type: 'literal', pattern: '$homer.as^', match: '$homer.as^' });
			expect(result[0].hasMatch()).toBe(true);
		});
	});

	describe('capture()[x].getGroups()', function ()
	{
		it('should return an empty array if not matching', function ()
		{
			let result = capture(['homer.txt'], '^homer.txt$');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.txt'], '$homer.txt^');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['^^homer.txt$$'], '^homer.txt$');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);
		});
	});
});

/*
 * -------------------------------------------------------------------------------------------
 * ------------------------ Tests mixed wildcards and literals -------------------------------
 * -------------------------------------------------------------------------------------------
 */
describe('When a mix of wildcards and literal parts are used in glob pattern', function ()
{
	describe('capture()[x].getGroups()', function ()
	{
		it('should return an array of {type, pattern, match} for each part of the pattern, if all parts match', function ()
		{
			let result = capture(['homer.js'], '*.?s');
			expect(result[0].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '*', match: 'homer' });
			expect(result[0].getGroups()[1]).toEqual({ type: 'literal', pattern: '.', match: '.' });
			expect(result[0].getGroups()[2]).toEqual({ type: 'wildcard', pattern: '?', match: 'j' });
			expect(result[0].getGroups()[3]).toEqual({ type: 'literal', pattern: 's', match: 's' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], 'h*?');
			expect(result[0].getGroups()[0]).toEqual({ type: 'literal', pattern: 'h', match: 'h' });
			expect(result[0].getGroups()[1]).toEqual({ type: 'wildcard', pattern: '*', match: 'omer.j' });
			expect(result[0].getGroups()[2]).toEqual({ type: 'wildcard', pattern: '?', match: 's' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], '?**?');
			expect(result[0].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '?', match: 'h' });
			expect(result[0].getGroups()[1]).toEqual({ type: 'wildcard', pattern: '*', match: 'omer.j' });
			expect(result[0].getGroups()[2]).toEqual({ type: 'wildcard', pattern: '?', match: 's' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], '???*??**???');
			expect(result[0].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '?', match: 'h' });
			expect(result[0].getGroups()[1]).toEqual({ type: 'wildcard', pattern: '?', match: 'o' });
			expect(result[0].getGroups()[2]).toEqual({ type: 'wildcard', pattern: '?', match: 'm' });
			expect(result[0].getGroups()[3]).toEqual({ type: 'wildcard', pattern: '*', match: '' });
			expect(result[0].getGroups()[4]).toEqual({ type: 'wildcard', pattern: '?', match: 'e' });
			expect(result[0].getGroups()[5]).toEqual({ type: 'wildcard', pattern: '?', match: 'r' });
			expect(result[0].getGroups()[6]).toEqual({ type: 'wildcard', pattern: '*', match: '' });
			expect(result[0].getGroups()[7]).toEqual({ type: 'wildcard', pattern: '?', match: '.' });
			expect(result[0].getGroups()[8]).toEqual({ type: 'wildcard', pattern: '?', match: 'j' });
			expect(result[0].getGroups()[9]).toEqual({ type: 'wildcard', pattern: '?', match: 's' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['homer.js'], '?o??r**.*');
			expect(result[0].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '?', match: 'h' });
			expect(result[0].getGroups()[1]).toEqual({ type: 'literal', pattern: 'o', match: 'o' });
			expect(result[0].getGroups()[2]).toEqual({ type: 'wildcard', pattern: '?', match: 'm' });
			expect(result[0].getGroups()[3]).toEqual({ type: 'wildcard', pattern: '?', match: 'e' });
			expect(result[0].getGroups()[4]).toEqual({ type: 'literal', pattern: 'r', match: 'r' });
			expect(result[0].getGroups()[5]).toEqual({ type: 'wildcard', pattern: '*', match: '' });
			expect(result[0].getGroups()[6]).toEqual({ type: 'literal', pattern: '.', match: '.' });
			expect(result[0].getGroups()[7]).toEqual({ type: 'wildcard', pattern: '*', match: 'js' });
			expect(result[0].hasMatch()).toBe(true);

			result = capture(['bart.bar', 'lisa', 'maggie.', 'mr.burns'], '*.');
			expect(result[2].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '*', match: 'maggie' });
			expect(result[2].getGroups()[1]).toEqual({ type: 'literal', pattern: '.', match: '.' });
			expect(result[2].hasMatch()).toBe(true);
			expect(result[0].hasMatch()).toBe(false);
			expect(result[1].hasMatch()).toBe(false);
			expect(result[3].hasMatch()).toBe(false);

			// * is greedy
			result = capture(['homer.js'], '*??*');
			expect(result[0].getGroups()[0]).toEqual({ type: 'wildcard', pattern: '*', match: 'homer.' });
			expect(result[0].getGroups()[1]).toEqual({ type: 'wildcard', pattern: '?', match: 'j' });
			expect(result[0].getGroups()[2]).toEqual({ type: 'wildcard', pattern: '?', match: 's' });
			expect(result[0].getGroups()[3]).toEqual({ type: 'wildcard', pattern: '*', match: '' });
			expect(result[0].hasMatch()).toBe(true);
		});

		it('should return an empty array if any part, except for wildcard *, of the glob does not match', function ()
		{
			let result = capture(['homer.js'], '*.js?');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], '*.???');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], '*..??');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);
		});

		it('should return an empty array if glob does not completely match the name', function ()
		{
			let result = capture(['homer.js'], '?js');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], '?');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], '*.?');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['homer.js'], 'ho*?j');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture(['bart.bar', 'lisa', 'maggie.', 'mr.burns'], '*.');
			expect(result[0].getGroups()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);
			expect(result[1].getGroups()).toHaveLength(0);
			expect(result[1].hasMatch()).toBe(false);
			expect(result[3].getGroups()).toHaveLength(0);
			expect(result[3].hasMatch()).toBe(false);
			expect(result[2].hasMatch()).toBe(true);
		});
	});
});

/*
 * Testing Error Cases for capture().getGroups()
 */
describe('When element in names array is not a string', function ()
{
	describe('capture()[x].getGroups()', function ()
	{
		it('should return an array containing an Error object', function ()
		{
			// @ts-ignore
			let result = capture([0], '*.txt');
			expect(result.length).toBe(1);


			expectInstanceOfError(result[0].getGroups()[0]);

			expect(result[0].hasMatch()).toBe(false);

			result = capture([undefined], 'bob');
			expect(result[0].getGroups().length).toBe(1);

			expectInstanceOfError(result[0].getGroups()[0]);

			expect(result[0].hasMatch()).toBe(false);

			// @ts-ignore
			result = capture([['name.txt']], 'bob');
			expect(result[0].getGroups().length).toBe(1);
			expectInstanceOfError(result[0].getGroups()[0]);
			expect(result[0].hasMatch()).toBe(false);

			// @ts-ignore
			result = capture(['homer', {}], '?');
			expect(result.length).toBe(2);

			expectInstanceOfNotError(result[0].getGroups()[0]);

			expectInstanceOfError(result[1].getGroups()[0]);

			expect(result[0].hasMatch()).toBe(false);
			expect(result[1].hasMatch()).toBe(false);
		});
	});
});

/*
 * Testing Error Cases for capture().getAsterisk()
 */
describe('When invalid parameters are given to capture()', function ()
{
	describe('capture()[x].getAsterisk()', function ()
	{
		it('should return an empty array', function ()
		{
			// @ts-ignore
			let result = capture([0], '*.txt');
			expect(result.length).toBe(1);
			expect(result[0].getAsterisk()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture([undefined], 'bob');
			expect(result[0].getAsterisk()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			// @ts-ignore
			result = capture(['homer', {}], '*');
			expect(result.length).toBe(2);
			expect(result[0].getAsterisk()).not.toHaveLength(0);
			expect(result[1].getAsterisk()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(true);
			expect(result[1].hasMatch()).toBe(false);
		});
	});
});

/*
 * Testing Error Cases for capture().getQuestionMark()
 */
describe('When invalid parameters are given to capture()', function ()
{
	describe('capture()[x].getQuestionMark()', function ()
	{
		it('should return an empty array', function ()
		{
			// @ts-ignore
			let result = capture([0], '?.txt');
			expect(result.length).toBe(1);
			expect(result[0].getQuestionMark()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			result = capture([undefined], 'bob');
			expect(result[0].getQuestionMark()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(false);

			// @ts-ignore
			result = capture(['homer', {}], '?????');
			expect(result.length).toBe(2);
			expect(result[0].getQuestionMark()).not.toHaveLength(0);
			expect(result[1].getQuestionMark()).toHaveLength(0);
			expect(result[0].hasMatch()).toBe(true);
			expect(result[1].hasMatch()).toBe(false);
		});
	});
});

/*
 * =============================================
 *      Test for deconstruct() Method
 * =============================================
 */
describe('When called with invalid glob', function ()
{
	describe('deconstruct()', function ()
	{
		it('should return an empty array', function ()
		{
			// @ts-ignore
			expect(deconstruct(123)).toEqual([]);
			// @ts-ignore
			expect(deconstruct({})).toEqual([]);
			// @ts-ignore
			expect(deconstruct([])).toEqual([]);
			// @ts-ignore
			expect(deconstruct(true)).toEqual([]);
			// @ts-ignore
			expect(deconstruct('')).toEqual([]);
			// @ts-ignore
			expect(deconstruct()).toEqual([]);
		});
	});
});

describe('When called with valid glob', function ()
{
	describe('deconstruct()', function ()
	{
		it(`should return an array containing the glob's distinct parts`, function ()
		{
			let result = deconstruct('**');
			expect(result).toEqual(['*', '*']);
			result = deconstruct('???');
			expect(result).toEqual(['?', '?', '?']);
			result = deconstruct('ab\\');
			expect(result).toEqual(['ab\\']);
			result = deconstruct('*?**??\\ba');
			expect(result).toEqual(['*', '?', '*', '*', '?', '?', '\\ba']);
			result = deconstruct('?\\\\?\***');
			expect(result).toEqual(['?', '\\\\', '?', '*', '*', '*']);
			result = deconstruct('\/\*\*\???');
			expect(result).toEqual(['\/', '*', '*', '?', '?', '?']);
		});
	});
});

describe('When called with option collapse === true', function ()
{
	describe('deconstruct()', function ()
	{
		it('should treat consecutive * as one', function ()
		{
			const opt = { collapse: true };
			let result = deconstruct('****', opt);
			expect(result).toEqual(['*']);
			result = deconstruct('*?a**?**c?*', opt);
			expect(result).toEqual(['*', '?', 'a', '*', '?', '*', 'c', '?', '*']);
			result = deconstruct('??**?\****.**', opt);
			expect(result).toEqual(['?', '?', '*', '?', '*', '.', '*']);
		});
	});
});

function expectInstanceOfError<T extends Error>(err, target = Error): asserts err is T
{
	expect(err).toBeInstanceOf(target);
	expect(err).toMatchSnapshot();
}

function expectInstanceOfNotError<T extends Error>(err, target = Error): asserts err is T
{
	expect(err).not.toBeInstanceOf(target);
	expect(err).toMatchSnapshot();
}
