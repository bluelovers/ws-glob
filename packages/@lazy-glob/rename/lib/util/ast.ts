import { IPartAstInterface, IQuestionMark, EnumWildcard, IAsterisk } from '../types';

export function isAsterisk(g: any | IPartAstInterface): g is IAsterisk
{
	return (g.type === 'wildcard' && g.pattern === EnumWildcard.Asterisk);
}

export function isQuestionMark(g: any | IPartAstInterface): g is IQuestionMark
{
	return (g.type === 'wildcard' && g.pattern === EnumWildcard.QuestionMark);
}
