/**
 * Created by user on 2018/3/30/030.
 */
import { IOptionsNovelGlobby as IOptions } from '@lazy-glob/util/lib/types';
import { IReturnOptions } from '@lazy-glob/util/lib/types/glob';
export * from '@lazy-glob/util/lib/types/glob';
export declare const defaultPatternsExclude: string[];
export declare const defaultPatterns: string[];
export declare const defaultOptions: IOptions;
export declare function getOptions(options: IOptions): IReturnOptions;
export declare function getOptions(patterns?: string[], options?: IOptions): IReturnOptions;
export declare function getOptions2(options: IOptions): IReturnOptions;
export declare function getOptions2(patterns?: string[], options?: IOptions): IReturnOptions;
export declare function getOptionsRuntime(options: IOptions | IReturnOptions["options"]): IReturnOptions["options"];
declare const _default: typeof import("./options");
export default _default;
