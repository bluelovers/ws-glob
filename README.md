# node-novel-globby

> globby module for node-novel

`npm install node-novel-globby`

## options

- useDefaultPatternsExclude: true
- useAutoHandle: true
- disableSort: false
- libPromise: Promise from bluebird

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
import globbyASync from 'node-novel-globby';
import { globbyASync, globbySync } from 'node-novel-globby';
const globbyASync = require('node-novel-globby').globbyASync;
```

```ts
globbyASync().tap(function (ls)
{
	console.log(ls);
});

console.log(globbySync());
```
