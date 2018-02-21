# node-novel-globby

> globby with sort id/chinese/fullwidth number for node-novel

`npm install node-novel-globby`

## options

- useDefaultPatternsExclude: true
- disableAutoHandle: false
- disableSort: false
- libPromise: Promise from bluebird
- throwEmpty: true - throw error when list is empty
- checkRoman: false - if true will sort roman as number
- sortCallback - sort compare function

### defaultPatternsExclude

```javascript
[
	'!**/*.raw.*',
	'!**/*.new.*',
	'!**/out/**/*',
	'!**/raw/**/*',
	'!**/*_out/**/*',
	'!**/待修正屏蔽字.txt',
	'!**/英語.txt',
	'!**/node_modules/**/*',
	'!**/.*/**/*',
	'!**/~*/**/*',
	'!**/~*',
	'!**/.*',
]
```

## demo

```ts
import novelGlobby from 'node-novel-globby';
import { globbyASync, globbySync, returnGlobList } from 'node-novel-globby';
const globbyASync = require('node-novel-globby').globbyASync;
```

```ts
globbyASync(patterns: string[], options: IOptions)
	.tap(function (ls)
	{
		console.log(ls);
	})
	.then(returnGlobList)
	.tap(function (ls)
	{
		console.log(ls);
	})
;

console.log(globbySync());
```

### output

```js
{ temp: 
   [ { path: 'temp/00000_序曲.txt',
       path_dir: 'temp',
       dir: 'temp',
       file: '00000_序曲',
       ext: '.txt',
       volume_title: 'temp',
       chapter_title: '序曲',
       val_file: '00000_序曲',
       val_dir: 'temp' },
     { path: 'temp/0000_转载信息.64849.txt',
       path_dir: 'temp',
       dir: 'temp',
       file: '0000_转载信息.64849',
       ext: '.txt',
       volume_title: 'temp',
       chapter_title: '转载信息',
       val_file: '0000_転載信息.64849',
       val_dir: 'temp' },
     { path: 'temp/六話　練級 経験值来源都多虧了山賊.txt',
       path_dir: 'temp',
       dir: 'temp',
       file: '六話　練級 経験值来源都多虧了山賊',
       ext: '.txt',
       volume_title: 'temp',
       chapter_title: '六話　練級 経験值来源都多虧了山賊',
       val_file: '0006_練級_経験值来源都多虧了山賊',
       val_dir: 'temp' },
     { path: 'temp/123.txt',
       path_dir: 'temp',
       dir: 'temp',
       file: '123',
       ext: '.txt',
       volume_title: 'temp',
       chapter_title: '123',
       val_file: '0123',
       val_dir: 'temp' } ] }
```

### with returnGlobList

```js
[ 'temp/00000_序曲.txt',
  'temp/0000_转载信息.64849.txt',
  'temp/六話　練級 経験值来源都多虧了山賊.txt',
  'temp/123.txt' ]
```

## getOptions(patterns, options)

1
```ts
let ret = getOptions(patterns, options);
[patterns, options] = [ret.patterns, ret.options];
```
2
```ts
[patterns, options] = getOptions(patterns, options);
```


## use like globby

```ts
import globby, { globbyASync, globbySync } from 'node-novel-globby/g';
```

```ts
globby(patterns, options)
globby.sync(patterns, options)
globby.async(patterns, options)

globbyASync(patterns, options)
globbySync(patterns, options)
```
