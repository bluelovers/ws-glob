import { IResultGlobListReturnRow, IOptionsGlobRename } from './types';
import { moveSync } from 'fs-extra';
import { resolve } from 'path';

export function defaultRenameHandler(result: IResultGlobListReturnRow, options: IOptionsGlobRename)
{
	if (result.changed === true)
	{
		moveSync(resolve(options.cwd, result.source), resolve(options.cwd, result.target))
	}
	else if (options.disallowResultNotChanged === true && result.changed === false)
	{
		throw new Error(`source filename should not same as dest filename: ${result.source}`)
	}
}
