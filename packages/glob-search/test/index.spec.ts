import { globSearchSync, globSearch } from '../index';

test(`globSearch`, async () =>
{

	let actual = await globSearch('*/demo.ts', {
			disableThrowWhenEmpty: true,
		})
		.tap(function (data)
		{
			console.log(data);
			expect(data.value[0]).toStrictEqual('test/demo.ts')
		})
		.catch(console.error)
	;

	expect(actual).toMatchSnapshot();

});

test(`globSearchSync`, () =>
{

	let actual = globSearchSync('*/demo.ts', {
			disableThrowWhenEmpty: true,
		})
		.catch(console.error)
		.then(v => v)
		.tap(function (data)
		{
			console.log(data);
			expect(data.value[0]).toStrictEqual('test/demo.ts')
		})
	;

	expect(actual).toMatchSnapshot();

});
