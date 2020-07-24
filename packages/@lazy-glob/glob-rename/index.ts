import { globRenameResult } from './lib/globRenameResult';
import { IResultGlobListRow, IOptionsGlobRenameResult, IOptionsGlobRename } from './lib/types';
import { defaultRenameHandler } from './lib/defaultRenameHandler';

export * from './lib/types';

export { globRenameResult }

export function globRenameSync(searchGlobPattern: string | string[],
	resultGlobList: IResultGlobListRow | IResultGlobListRow[],
	options: IOptionsGlobRename,
)
{
	const { handler  = defaultRenameHandler } = options

	const resultList = globRenameResult(searchGlobPattern, resultGlobList, options);

	for (const result of resultList)
	{
		handler(result, options)
	}
}

export async function globRenameAsync(searchGlobPattern: string | string[],
	resultGlobList: IResultGlobListRow | IResultGlobListRow[],
	options: IOptionsGlobRename,
)
{
	const { handler = defaultRenameHandler } = options

	const resultList = globRenameResult(searchGlobPattern, resultGlobList, options);

	for await (const result of resultList)
	{
		await handler(result, options)
	}
}

export default globRenameSync
