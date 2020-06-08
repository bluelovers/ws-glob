import { inspect } from 'util'
import sortTree from '../index';

describe(`no empty`, () =>
{
	[
		[
			'packages/@yarn-tool/ws-changed/lib/',
			'packages/@yarn-tool/ws-changed/',
			'packages/ws-pkg-list/lib/',
			'packages/@yarn-tool/find-root/',
		],
	].forEach(ls =>
	{

		test(inspect(ls), () =>
		{
			const len = ls.length;

			let expected = ls.slice();
			let actual = sortTree(ls);

			expect(actual).toHaveLength(len);
			expect(actual).toContain(expected);
			expect(actual).toMatchSnapshot();

		});

	})

})
