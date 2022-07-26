import { IOptions as GlobbyOptions } from 'glob';
import Bluebird from 'bluebird';
import { IReturnRow } from 'node-novel-globby';
import { SymGlobTree } from '../index';

export type ITreeEntries = string | ITreeRow | null;

export type ITreeRow = {
	[key: string]: ITreeEntries;
	[SymGlobTree]?: any,
}

export type ITree = {
	[key: string]: string | ITreeRow | null;
	[SymGlobTree]?: any,
}

export type IOptionsNovelGlobby = GlobbyOptions & {
	cwd?: string,
	absolute?: boolean,

	useDefaultPatternsExclude?: boolean,

	disableAutoHandle?: boolean,
	disableSort?: boolean,

	libPromise?: Bluebird<unknown>,

	onListRow?<T>(a: T, row: IReturnRow, options: IOptionsNovelGlobby): IReturnRow,

	throwEmpty?: boolean,

	sortCallback?(a, b): number,

	sortFn?<T>(arr: T): T,

	padNum?: number,

	checkRoman?: boolean,
}
