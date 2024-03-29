import { IResultGlobListRow, IOptionsGlobRenameResult, IResultGlobListReturnRow } from './types';
import { handleResultGlobList } from './handleResultGlobList';
import { handleOptions } from './handleOptions';
import { sync as syncFastGlob } from '@bluelovers/fast-glob';
import { globRenameResultCore } from './globRenameResultCore';

export function globRenameResult(searchGlobPattern: string | string[],
	resultGlobList: IResultGlobListRow | IResultGlobListRow[],
	options: IOptionsGlobRenameResult = {},
)
{
	if (!searchGlobPattern.length)
	{
		throw new TypeError(`invalid options`)
	}

	resultGlobList = handleResultGlobList(resultGlobList);

	options = handleOptions(options);

	const fileList = syncFastGlob(searchGlobPattern, options.globOptions) as any as string[];

	return globRenameResultCore(fileList, resultGlobList, options)
}
