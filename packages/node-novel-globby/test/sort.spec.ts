import { globby, globToList, returnGlobList } from '../index';
import { join, normalize } from 'upath2';
import { readFileSync } from 'fs-iconv';

describe(`res2/*.txt`, () =>
{
	let ls = globby.sync('res2/*.txt', {
		cwd: __dirname,
	});

	const options = {
		checkRoman: true,
		onListRow(a, row, options)
		{
			//console.log(row);
			return row;
		},
	};

	const __root = normalize(join(__dirname, '..'));

	ls.forEach(function (file)
	{
		test(file, () =>
		{
			const txt = readFileSync(join(__dirname, file));

			const a = txt.toString().split("\n").filter(function (v)
			{
				//console.log(v, v.trim() !== '');
				return v.trim() !== '';
			});

			let c = globToList(a, options);
			let b = returnGlobList(c);

			expect(b).toStrictEqual(a);
			//expect(actual).toBeInstanceOf(Date);
			expect(b).toMatchSnapshot();

			Object.entries(c)
				.forEach(([key, row]) => {

					row.forEach(sub => {


						sub.path = sub.path.replace(__root, '[__root]');
						sub.path_dir = sub.path_dir.replace(__root, '[__root]');

					})

				})
			;

			expect(c).toMatchSnapshot();

		});
	})

})
