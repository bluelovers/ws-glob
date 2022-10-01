import { globToTree } from 'glob-tree-list/src/index';
import { inspect } from "util";
import { sort, entries_sort, entries_reduce } from '../src/index';

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
			let actual = globToTree(ls);

			let r = Object.entries(actual);
			let a1 = entries_sort(r);
			let a2 = entries_reduce(a1);

			let expected = sort(a2);

			expect(actual).toStrictEqual(expected);
			expect(actual).toStrictEqual(a2);

			expect(actual).toMatchSnapshot();
			expect(r).toMatchSnapshot();
			expect(a1).toMatchSnapshot();

		});

	})

})
