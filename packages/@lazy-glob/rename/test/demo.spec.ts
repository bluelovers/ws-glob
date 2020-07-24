
import { inspect } from 'util';
import { computeName } from '../lib/util/computeName';

describe(`demo`, () =>
{

	([

		['123.456', '*.*', '**'],
		['123.456', '*.*', '*.ts'],
		[[
			'larry-fine-lines-season1-episode3.txt',
			'moe-howard-lines-s04-ep01.txt',
			'curly-howard-lines-s2-e2.txt',
		], '**-*-lines-*?-*?.txt', '*_*-lines-s?e?.txt'],

		[[
			'larry-fine-lines-season1-episode3.txt',
			'moe-howard-lines-s04-ep01.txt',
			'curly-howard-lines-s2-e2.txt',
		], '*.txt', 'temp/*.old'],

	] as Parameters<typeof computeName>[]).forEach(argv => {

		test(inspect(argv), () =>
		{

			let actual = computeName(...argv);

			console.dir(actual);

			expect(actual).toMatchSnapshot();

		});

	})

})
