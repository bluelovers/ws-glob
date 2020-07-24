import { IOptionsGlobRenameResult } from './types';

export function handleOptions(options: IOptionsGlobRenameResult = {})
{
	options.globOptions ??= {};

	const cwd = options.cwd ?? options.globOptions.cwd ?? process.cwd();

	options.globOptions.cwd = options.cwd = cwd;

	options.pipeResult = !!options.pipeResult;

	return options
}
