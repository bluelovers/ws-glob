# glob-search

    glob search from current cwd up to root or stopPath

## install

```bash
npm install glob-search
```

## API

* [index.d.ts](index.d.ts)

```ts
export declare function globSearch<T extends EntryItem = string>(pattern: string | string[], options?: IOptions<T>): Bluebird<IReturnValue<T>>;

export declare function globSearchSync<T extends EntryItem = string>(pattern: string | string[], options?: IOptions<T>): IReturnValueSync<T>;

export interface IOptions<T extends EntryItem> extends FastGlob.Options<T> {
    cwd?: string;
    deep?: number | boolean;
    /**
     * @default current package path
     */
    stopPath?: string | string[] | boolean;
    /**
     * @default true
     */
    followSymlinkedDirectories?: boolean;
    sortCompareFn?: boolean | ((a: T, b: T) => number);
    ignore?: string[];
    disableThrowWhenEmpty?: boolean;
    pathLib?: IPathLibBase;
}

export interface IReturnValue<T extends EntryItem> {
    value: T[];
    cwd: string;
    pattern: string[];
    options: IOptionsRuntime<T>;
    history: string[];
    errData?: Partial<IReturnError<T>>;
}

export interface IReturnValueSync<T extends EntryItem> extends IReturnValue<T> {
    then<R>(fn: (data: IReturnValueSync<T>) => R): R;
    catch<R>(fn: (err: IReturnError<T>) => R): IReturnValueSync<T> & R;
    tap(fn: (data: IReturnValueSync<T>) => any): IReturnValueSync<T>;
    tapCatch(fn: (err: IReturnError<T>) => any): IReturnValueSync<T>;
}

export declare type IReturnError<T extends EntryItem, E extends Error = Error> = E & {
    message: string;
    _data: {
        cwd: string;
        pattern: string[];
        options: IOptionsRuntime<T>;
        history: string[];
    };
};
```

## demo

```
    /
    └── ws-ts-uglify
        └── package.json
        └── test
            ├── demo.ts
            ├── demo.d.ts
            └── demo.js
        └── packages
            └── glob-search
                ├── package.json
                └── test
                    ├── demo.ts
                    └── demo.js
```

[demo.ts](test/demo.ts)

```ts
import { globSearch, globSearchSync, async, sync } from 'glob-search';
import { expect } from 'chai';
```

### async

```ts
globSearch('*/demo.ts', {
	//disableThrowWhenEmpty: true,
})
	.tap(function (data)
	{
		console.log(data);
		expect(data.value[0]).to.deep.equal('test/demo.ts')
	})
	.catch(console.error)
;
```

### sync

```ts
let data = globSearchSync('*/demo.ts', {
	//disableThrowWhenEmpty: true,
});

console.log(data);
expect(data.value[0]).to.deep.equal('test/demo.ts');
```

> fake async style

```ts
globSearchSync('*/demo.ts', {
	//disableThrowWhenEmpty: true,
})
	.tap(function (data)
	{
		console.log(data);
		expect(data.value[0]).to.deep.equal('test/demo.ts')
	})
	.catch(console.error)
;
```



### output

> by the default will set `stopPath` in current package root, can set it to `false` or other value

```json5
{ value: [ 'test/demo.ts' ],
  cwd:
   '/ws-ts-uglify/packages/glob-search',
  options:
   { followSymlinkedDirectories: true,
     markDirectories: true,
     unique: true,
     cwd:
      '/ws-ts-uglify/packages/glob-search',
     ignore: [],
     stopPath:
      [ '/ws-ts-uglify/packages/glob-search' ],
     disableThrowWhenEmpty: false },
  history:
   [ '/ws-ts-uglify/packages/glob-search/test',
     '/ws-ts-uglify/packages/glob-search' ] }
```
