/**
 * For each string in names array, return a globGroupsCollection (an object implementing globGroupsCollectionInterface) containing the substring matched by each part of the glob pattern.
 * Example of parts of a glob: "?omer.*" => Parts: ["?"] ["omer."] ["*"]
 * @method capture
 * @param names {String[]} List of names
 * @param glob {String} The glob pattern to be applied to names
 * @return {globGroupsCollection[] | null} An array of globGroupsCollection objects. Returns null if invalid parameters or names list is empty.
 */
import { globGroupsCollectionFactory } from './globGroupsCollection';

function capture(names: string[], glob: string)
{
	if (!Array.isArray(names) || !names.length)
	{
		return null;
	}

	if ((typeof glob !== 'string') || !glob.length)
	{
		return null;
	}

	// For each name received, create an object of type 'globGroupsCollection' containing the match for each part of the glob
	return names.map(function buildGlobGroupsCollection(name)
	{
		let groupsObj = globGroupsCollectionFactory();
		groupsObj.initGroups(glob);
		groupsObj.buildGroups(name);
		return groupsObj;
	});
}
