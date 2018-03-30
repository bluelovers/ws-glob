/**
 * Created by user on 2018/3/29/029.
 */

import { globToTree, treeToGlob, ITree, ITreeRow } from './core';

const self = globToTree as typeof globToTree & {
	globToTree: typeof globToTree,
	treeToGlob: typeof treeToGlob,
	ITree: ITree,
	ITreeRow: ITreeRow,
	default: typeof globToTree
};

self.default = self.globToTree = globToTree;
self.treeToGlob = treeToGlob;

export = self;
