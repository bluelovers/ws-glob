export * from '@lazy-glob/util/lib/types/glob';
import { IOptions, IArrayDeepInterface } from '@lazy-glob/util/lib/types/glob';
import { IReturnRow } from './types';
export { IReturnRow };
export declare function glob_to_list_array(glob_ls: string[], options?: IOptions): IReturnRow[];
export declare function glob_to_list_array_deep(glob_ls: string[], options?: IOptions): IArrayDeepInterface<IReturnRow>;
export declare function pathToListRow(b: string, source_idx: number, options?: IOptions): IReturnRow;
declare const _default: typeof import("./list");
export default _default;
