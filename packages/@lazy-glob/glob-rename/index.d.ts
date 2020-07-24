import { globRenameResult } from './lib/globRenameResult';
import { IResultGlobListRow, IOptionsGlobRename } from './lib/types';
export * from './lib/types';
export { globRenameResult };
export declare function globRenameSync(searchGlobPattern: string | string[], resultGlobList: IResultGlobListRow | IResultGlobListRow[], options: IOptionsGlobRename): void;
export declare function globRenameAsync(searchGlobPattern: string | string[], resultGlobList: IResultGlobListRow | IResultGlobListRow[], options: IOptionsGlobRename): Promise<void>;
export default globRenameSync;
