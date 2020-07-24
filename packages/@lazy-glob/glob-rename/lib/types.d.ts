import { Options } from '@bluelovers/fast-glob';
import { ITSResolvable } from 'ts-type';
export interface IOptionsGlobRenameResult {
    cwd?: string;
    globOptions?: Options;
    pipeResult?: boolean;
}
export interface IOptionsGlobRename extends IOptionsGlobRenameResult {
    disallowResultNotChanged?: boolean;
    handler?(result: IResultGlobListReturnRow, options: IOptionsGlobRename): ITSResolvable<any>;
}
export declare type IResultGlobListRow = [string, string];
export interface IResultGlobListReturnRow {
    source: string;
    target: string;
    changed: boolean;
}
