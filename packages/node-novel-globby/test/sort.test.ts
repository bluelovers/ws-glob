/**
 * Created by user on 2018/2/21/021.
 */

import { globToList} from '../lib/index';
import { chai, relative, expect, path, assert, util, mochaAsync } from './_local-dev';

import { globby } from '../index';
import { globbyASync } from '../g';
import fs from 'fs-iconv';
import { returnGlobList } from '../lib/types';

// @ts-ignore
describe(relative(__filename), () =>
{
	let currentTest;

	// @ts-ignore
	beforeEach(function ()
	{
		// @ts-ignore
		currentTest = this.currentTest;

		//console.log('it:before', currentTest.title);
		//console.log('it:before', currentTest.fullTitle());
	});

	// @ts-ignore
	describe(`suite`, () =>
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

		ls.forEach(function (file)
		{
			const txt = fs.readFileSync(path.join(__dirname, file));

			const a = txt.toString().split("\n").filter(function (v)
			{
				//console.log(v, v.trim() !== '');
				return v.trim() !== '';
			});

			// @ts-ignore
			it(file, function ()
			{
				let c = globToList(a, options);
				let b = returnGlobList(c);

				fs.outputFileSync(path.join(__dirname, './temp', `${file}.txt`), b.join("\n"));
				fs.writeJsonSync(path.join(__dirname, './temp', `${file}.json`), c, {
					spaces: "\t",
				});


				//console.log(a);
				console.log(b);
				//console.log(c);

				expect(b).to.be.deep.equal(a);
			});
		});
	});
});
