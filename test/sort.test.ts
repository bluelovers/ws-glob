/**
 * Created by user on 2018/2/21/021.
 */

import { globToList, returnGlobList } from '../lib';
import { chai, relative, expect, path, assert, util, mochaAsync } from './_local-dev';

// @ts-ignore
import { describe, before, beforeEach, it, ITest } from 'mocha';

import { globby } from '../index';
import { globbyASync } from '../g';
import * as fs from 'fs-iconv';

// @ts-ignore
describe(relative(__filename), () =>
{
	let currentTest: ITest;

	beforeEach(function ()
	{
		currentTest = this.currentTest as ITest;

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
			}
		};

		ls.forEach(function (file)
		{
			const txt = fs.readFileSync(path.join(__dirname, file));

			const a = txt.toString().split("\n").filter(function (v)
			{
				//console.log(v, v.trim() !== '');
				return v.trim() !== '';
			});

			it(file, function ()
			{
				let b = returnGlobList(globToList(a, options));

				//console.log(a);
				console.log(b);

				expect(a).to.be.deep.equal(b);
			});
		});
	});
});
