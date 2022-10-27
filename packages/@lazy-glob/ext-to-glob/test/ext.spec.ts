//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { basename, extname } from 'path';
import { extToGlob, extToRegexpPattern, removeDotFromExtensions } from '../src/index';

beforeAll(async () =>
{

});

const demo = [
	".cts", ".mts", ".umd.ts", ".ts", ".tsx", ".jsx", ".cjs", ".mjs", ".umd.js", ".js"
] as const;

test(`extToGlob`, () =>
{

	let actual = extToGlob(demo);

	expect(actual).toMatchSnapshot();

});

test(`extToRegexpPattern`, () =>
{

	let actual = extToRegexpPattern(demo);

	expect(actual).toMatchSnapshot();

});

test(`removeDotFromExtensions`, () =>
{

	let actual = removeDotFromExtensions(demo);

	expect(actual).toMatchSnapshot();

});
