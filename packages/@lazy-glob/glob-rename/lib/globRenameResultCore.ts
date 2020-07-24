import { IResultGlobListRow, IOptionsGlobRenameResult, IResultGlobListReturnRow } from './types';
import { computeName } from '@lazy-glob/rename';

export function* globRenameResultCore(fileList: string[],
	resultGlobList: IResultGlobListRow[],
	options: IOptionsGlobRenameResult,
)
{
	const { pipeResult } = options;

	for (const source of fileList)
	{
		let target: string = source;
		let changed = false;

		for (let [srcGlob, dstGlob] of resultGlobList)
		{
			target = computeName(source as string, srcGlob, dstGlob)[0]

			if (pipeResult !== true)
			{
				break;
			}
		}

		changed = target !== source;

		yield <IResultGlobListReturnRow>{
			source,
			target,
			changed,
		}
	}
}
