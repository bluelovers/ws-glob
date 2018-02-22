import * as deromanize from 'deromanize';
import { IOptions } from './index';
export { deromanize };
export declare function normalize_val(str: string, padNum?: number, options?: IOptions): string;
export declare function isRoman(str: any): RegExpExecArray;
export declare function normalizeRoman(input: string, bool?: boolean): string;
export declare function circle2num(str: any): string;
import * as self from './helper';
export default self;
