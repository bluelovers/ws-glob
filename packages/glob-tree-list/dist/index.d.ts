/**
 * Created by user on 2018/3/29/029.
 */
import { ITree } from '@lazy-glob/util/lib/types';
export type { ITree };
export declare function globToTree(data: string[]): ITree;
export declare function treeToGlob(a: ITree, d?: string[]): string[];
export default globToTree;
