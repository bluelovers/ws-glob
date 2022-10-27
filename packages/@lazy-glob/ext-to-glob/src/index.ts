import { escapeRegExp } from 'regexp-helper-core';


export type IExtString<T extends string = string> = `.${T}`

export function removeDot<T extends string>(ext: IExtString<T>)
{
	return ext.replace(/^\./, '') as T
}

export function removeDotFromExtensions<T extends string>(arr: readonly IExtString<T>[], fns?: ((input: string) => string)[])
{
	return arr.map(input => {
		input = removeDot(input) as any;
		fns?.forEach(fn => {
			input = fn(input) as any;
		})
		return input
	})
}

export function extToGlob<T extends string>(arr: readonly IExtString<T>[])
{
	return `.+(${removeDotFromExtensions(arr).join('|')})` as const
}

export function extToRegexpPattern<T extends string>(arr: readonly IExtString<T>[])
{
	return `.(${removeDotFromExtensions(arr, [escapeRegExp]).join('|')})$` as const
}

export default extToGlob
