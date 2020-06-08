/**
 * Created by user on 2020/6/9.
 */

export type ISortEntriesSortRow2 = [string, string | ISortEntriesSortRow[], boolean?]

export type ISortEntriesSortRow = [string, string | ISortEntriesSortRow2[], boolean?]

export type ISortEntriesSort = ISortEntriesSortRow[]

export const a: ISortEntriesSort = [
	[
		'packages/',
		[
			[
				'@yarn-tool/',
				[
					[ 'find-root/', [] ],
					[ 'ws-changed/', [ [ 'lib/', [] ] ] ]
				]
			],
			[ 'ws-pkg-list/', [ [ 'lib/', [] ] ] ]
		]
	]
]

