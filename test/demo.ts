/**
 * Created by user on 2018/12/4/004.
 */

import { globSearch, globSearchSync, async, sync } from '..';
import { expect } from 'chai';
import Bluebird = require('bluebird');

globSearch('*/demo.ts', {
	disableThrowWhenEmpty: true,
})
	.tap(function (data)
	{
		console.log(data);
		expect(data.value[0]).to.deep.equal('test/demo.ts')
	})
	.catch(console.error)
;

globSearchSync('*/demo.ts', {
	disableThrowWhenEmpty: true,
})
	.catch(console.error)
	.then(v => v)
	.tap(function (data)
	{
		console.log(data);
		expect(data.value[0]).to.deep.equal('test/demo.ts')
	})

;

Bluebird.resolve(globSearchSync('*/demo.ts', {
		disableThrowWhenEmpty: true,
	}).tap(function (v)
	{
		console.log(Object.keys(v));
		// => [ 'value', 'cwd', 'pattern', 'options', 'history', 'then', catch', 'tapCatch' ]
		return Promise.resolve(v)
	}),
	)
	.then(v => v)
	.tap(function (v)
	{
		console.log(Object.keys(v));
		// => [ 'value', 'cwd', 'pattern', 'options', 'history' ]
		return v
	})
	.then(function (v)
	{
		console.log(Object.keys(v));
		// => [ 'value', 'cwd', 'pattern', 'options', 'history' ]
		return v
	})
	.tap(function (v)
	{
		console.log(Object.keys(v));
		// => [ 'value', 'cwd', 'pattern', 'options', 'history' ]
		return v
	})
;
