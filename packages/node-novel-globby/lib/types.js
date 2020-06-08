"use strict";
/**
 * Created by user on 2020/6/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnGlobList = void 0;
function returnGlobList(ls, options = {}) {
    let useSourcePath = (options.useSourcePath === true || options.useSourcePath === false)
        ? options.useSourcePath
        : !options.absolute;
    if (!ls) {
        return [];
    }
    return Object.values(ls)
        .reduce(function (a, b) {
        Object.values(b)
            .forEach(function (value, index, array) {
            a.push(useSourcePath ? value.source_path : value.path);
        });
        return a;
    }, []);
    /*
    return Object.keys(ls)
        .reduce(function (a: string[], b)
        {
            ls[b].forEach(function (value, index, array)
            {
                a.push(useSourcePath ? value.source_path : value.path);
            });

            return a;
        }, [])
        ;
    */
}
exports.returnGlobList = returnGlobList;
//# sourceMappingURL=types.js.map