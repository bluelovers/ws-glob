export enum EnumWildcard
{
	Asterisk = '*',
	QuestionMark = '?',
}

export enum EnumPartsAstType
{
	wildcard = 'wildcard',
	literal = 'literal',
}

export interface IPartAstInterface
{
	type: EnumPartsAstType,
	pattern: string,
	match: string,
}

export interface IAsterisk extends IPartAstInterface
{
	type: EnumPartsAstType.wildcard,
	pattern: EnumWildcard.Asterisk,
}

export interface IQuestionMark
{
	type: EnumPartsAstType.wildcard,
	pattern: EnumWildcard.QuestionMark,
}

export interface ILiteral extends IPartAstInterface
{
	type: EnumPartsAstType.literal,
}

export type IPartsAst = IAsterisk | IQuestionMark | ILiteral;

export type IPartsPattern = IPartsAst["pattern"]
