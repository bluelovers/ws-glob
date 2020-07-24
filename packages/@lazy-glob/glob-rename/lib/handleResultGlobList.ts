import { IResultGlobListRow } from './types';

export function handleResultGlobList(resultGlobList: IResultGlobListRow | IResultGlobListRow[]): IResultGlobListRow[]
{
	if (!resultGlobList.length || !Array.isArray(resultGlobList))
	{
		throw new TypeError(`invalid resultGlobList`)
	}

	if (resultGlobList.length === 2 && typeof resultGlobList[0] === 'string' && typeof resultGlobList[1] === 'string')
	{
		resultGlobList = [resultGlobList as IResultGlobListRow];
	}

	return resultGlobList as IResultGlobListRow[]
}
