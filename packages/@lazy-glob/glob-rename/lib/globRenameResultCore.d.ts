import { IResultGlobListRow, IOptionsGlobRenameResult, IResultGlobListReturnRow } from './types';
export declare function globRenameResultCore(fileList: string[], resultGlobList: IResultGlobListRow[], options: IOptionsGlobRenameResult): Generator<IResultGlobListReturnRow, void, unknown>;
