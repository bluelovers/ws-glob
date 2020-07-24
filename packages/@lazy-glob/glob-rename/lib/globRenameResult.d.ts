import { IResultGlobListRow, IOptionsGlobRenameResult, IResultGlobListReturnRow } from './types';
export declare function globRenameResult(searchGlobPattern: string | string[], resultGlobList: IResultGlobListRow | IResultGlobListRow[], options?: IOptionsGlobRenameResult): Generator<IResultGlobListReturnRow, void, unknown>;
