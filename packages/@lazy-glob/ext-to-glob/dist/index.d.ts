export type IExtString<T extends string = string> = `.${T}`;
export declare function removeDot<T extends string>(ext: IExtString<T>): T;
export declare function removeDotFromExtensions<T extends string>(arr: readonly IExtString<T>[], fns?: ((input: string) => string)[]): `.${T}`[];
export declare function extToGlob<T extends string>(arr: readonly IExtString<T>[]): `.+(${string})`;
export declare function extToRegexpPattern<T extends string>(arr: readonly IExtString<T>[]): `.(${string})$`;
export default extToGlob;
