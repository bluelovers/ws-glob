"use strict";
/**
 * Created by user on 2018/12/4/004.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const fast_glob_1 = __importDefault(require("@bluelovers/fast-glob"));
const bluebird_1 = __importDefault(require("bluebird"));
const path_1 = __importDefault(require("path"));
const chai_1 = require("chai");
const string_natural_compare_1 = __importDefault(require("string-natural-compare"));
const find_root_1 = __importDefault(require("@yarn-tool/find-root"));
function globSearch(pattern, options) {
    ({ pattern, options } = handleArgs(pattern, options));
    const path = options.pathLib;
    return new bluebird_1.default(async (resolve, reject) => {
        let cwd = path.normalize(options.cwd);
        let opts = Object.assign({}, options);
        let history = [];
        let bool = true;
        if (await fs_extra_1.default.pathExists(cwd)) {
            while (bool) {
                if (cwd === '.' || cwd === '..') {
                    cwd = path.resolve(cwd);
                }
                history.push(cwd);
                //console.log(cwd);
                opts.cwd = cwd;
                let value = await fast_glob_1.default
                    .async(pattern, opts)
                    .catch(function (e) {
                    bool = false;
                    e._data = {
                        cwd,
                        pattern: pattern,
                        options: opts,
                        history,
                    };
                    reject(e);
                });
                if (!bool) {
                    return;
                }
                if (value.length) {
                    if (opts.sortCompareFn) {
                        value.sort(opts.sortCompareFn);
                    }
                    resolve({
                        value,
                        cwd,
                        pattern: pattern,
                        options: opts,
                        history,
                    });
                    break;
                }
                //console.log(cwd);
                if (opts.stopPath.includes(cwd)) {
                    //bool = false;
                    rejectFail(`stop search at ${cwd}`);
                    break;
                }
                /*
                let t = path.resolve(cwd);

                opts.ignore.push(cwd + path.sep);
                opts.ignore.push(cwd + path.sep + '**');

                if (t != cwd)
                {
                    opts.ignore.push(t + path.sep);
                    opts.ignore.push(t + path.sep + '**');
                }
                */
                cwd = path.resolve(cwd, '..');
                if (cwd === opts.cwd) {
                    //bool = false;
                    rejectFail(`there is no any parent path: ${cwd}`);
                    break;
                }
            }
            if (bool) {
                rejectFail(`unknow error`);
            }
        }
        else {
            rejectFail(`path not exists ${cwd}`);
        }
        function rejectFail(message) {
            bool = false;
            if (opts.disableThrowWhenEmpty) {
                resolve({
                    value: [],
                    cwd,
                    pattern: pattern,
                    options: opts,
                    history,
                    errData: {
                        message,
                        _data: {
                            cwd,
                            pattern: pattern,
                            options: opts,
                            history,
                        }
                    },
                });
            }
            else {
                reject(_error({
                    message,
                    _data: {
                        cwd,
                        pattern: pattern,
                        options: opts,
                        history,
                    }
                }));
            }
        }
    });
}
exports.globSearch = globSearch;
exports.async = globSearch;
function globSearchSync(pattern, options) {
    ({ pattern, options } = handleArgs(pattern, options));
    const path = options.pathLib;
    let cwd = path.normalize(options.cwd);
    let opts = Object.assign({}, options);
    let history = [];
    let bool = true;
    if (fs_extra_1.default.pathExistsSync(cwd)) {
        while (bool) {
            if (cwd === '.' || cwd === '..') {
                cwd = path.resolve(cwd);
            }
            history.push(cwd);
            //console.log(cwd);
            opts.cwd = cwd;
            let value;
            try {
                value = fast_glob_1.default.sync(pattern, opts);
            }
            catch (e) {
                return rejectFail(e);
            }
            if (!bool) {
                return;
            }
            if (value.length) {
                if (opts.sortCompareFn) {
                    value.sort(opts.sortCompareFn);
                }
                return resolve({
                    value,
                    cwd,
                    pattern,
                    options: opts,
                    history,
                });
                break;
            }
            //console.log(cwd);
            if (opts.stopPath.includes(cwd)) {
                //bool = false;
                return rejectFail(`stop search at ${cwd}`);
                break;
            }
            /*
            let t = path.resolve(cwd);

            opts.ignore.push(cwd + path.sep);
            opts.ignore.push(cwd + path.sep + '**');

            if (t != cwd)
            {
                opts.ignore.push(t + path.sep);
                opts.ignore.push(t + path.sep + '**');
            }
            */
            cwd = path.resolve(cwd, '..');
            if (cwd === opts.cwd) {
                //bool = false;
                return rejectFail(`there is no any parent path: ${cwd}`);
                break;
            }
        }
    }
    else {
        return rejectFail(`path not exists ${cwd}`);
    }
    return rejectFail(`unknow error`);
    function rejectFail(message) {
        bool = false;
        if (message instanceof Error) {
            // @ts-ignore
            message._data = {
                cwd,
                pattern,
                options: opts,
                history,
            };
            throw message;
        }
        if (opts.disableThrowWhenEmpty) {
            return resolve({
                value: [],
                cwd,
                pattern: pattern,
                options: opts,
                history,
                errData: {
                    // @ts-ignore
                    message,
                    _data: {
                        cwd,
                        pattern: pattern,
                        options: opts,
                        history,
                    }
                },
            });
        }
        else {
            throw _error({
                message,
                _data: {
                    cwd,
                    pattern: pattern,
                    options: opts,
                    history,
                }
            });
        }
    }
    function resolve(data) {
        return Object.assign(data, {
            then: function fakeThen(fn) {
                delete data.then;
                let ret = fn(data);
                handlePromise(ret, data);
                return ret;
            },
            catch: function fakeCatch(fn) {
                delete data.catch;
                let e = null;
                if (data.errData) {
                    e = _error(data.errData);
                    let ret = fn(e);
                    handlePromise(ret, data);
                    return ret;
                }
                else {
                    return data;
                }
            },
            tap: function fakeTap(fn) {
                delete data.tap;
                let ret = fn(data);
                if (handlePromise(ret, data)) {
                    return ret.then(function () {
                        return data;
                    });
                }
                return data;
            },
            tapCatch: function fakeTapCatch(fn) {
                let e = null;
                delete data.tapCatch;
                if (data.errData) {
                    e = _error(data.errData);
                }
                let ret = fn(e);
                if (handlePromise(ret, data)) {
                    return ret.then(function () {
                        return data;
                    });
                }
                return data;
            },
        });
    }
    function handlePromise(ret, data) {
        if (ret !== data && isPromise(ret)) {
            delete data.tap;
            delete data.tapCatch;
            delete data.then;
            delete data.catch;
            return true;
        }
        return false;
    }
}
exports.globSearchSync = globSearchSync;
exports.sync = globSearchSync;
function isPromise(ret) {
    if (bluebird_1.default.is(ret)) {
        return true;
    }
    else if (ret instanceof Promise) {
        return true;
    }
    return false;
}
exports.isPromise = isPromise;
function handleArgs(pattern, options) {
    if (typeof pattern === 'string') {
        pattern = [pattern];
    }
    chai_1.expect(pattern).is.an('array');
    pattern = pattern.filter(v => typeof v === 'string' && v !== '');
    chai_1.expect(pattern).have.lengthOf.gt(0);
    let opts = Object.assign({
        followSymlinkedDirectories: true,
        markDirectories: true,
        unique: true,
        cwd: process.cwd(),
        //stopPath: [],
        ignore: [],
    }, options || {});
    chai_1.expect(opts.cwd).is.an('string');
    opts.pathLib = opts.pathLib || path_1.default;
    const path = opts.pathLib;
    chai_1.expect(path.join).is.an('function');
    chai_1.expect(path.sep).is.an('string');
    chai_1.expect(path.normalize).is.an('function');
    chai_1.expect(path.resolve).is.an('function');
    let cwd = path.normalize(opts.cwd);
    if (cwd === '.' || cwd === '..') {
        cwd = path.resolve(cwd);
    }
    opts.cwd = cwd;
    if (opts.stopPath == null || opts.stopPath === true) {
        let { root } = find_root_1.default({
            cwd
        });
        opts.stopPath = [];
        if (root) {
            opts.stopPath.push(root);
        }
    }
    else if (typeof opts.stopPath === 'string') {
        opts.stopPath = [opts.stopPath];
    }
    else if (opts.stopPath === false) {
        opts.stopPath = [];
    }
    chai_1.expect(opts.stopPath).is.an('array');
    opts.stopPath = opts.stopPath.map(v => {
        if (typeof v !== 'string') {
            chai_1.expect(v, `options.stopPath must is string or string[]`).is.an('string');
        }
        return path.normalize(v);
    });
    if (opts.ignore == null) {
        opts.ignore = [];
    }
    else if (typeof opts.ignore === 'string') {
        opts.ignore = [opts.ignore];
    }
    chai_1.expect(opts.ignore).is.an('array');
    opts.ignore.forEach(v => {
        if (typeof v !== 'string') {
            chai_1.expect(v, `options.ignore must is string[]`).is.an('string');
        }
    });
    if (opts.sortCompareFn === true || opts.sortCompareFn == null) {
        opts.sortCompareFn = string_natural_compare_1.default;
    }
    else if (opts.sortCompareFn) {
        chai_1.expect(opts.sortCompareFn).is.an('function');
    }
    else {
        opts.sortCompareFn = null;
    }
    opts.disableThrowWhenEmpty = !!opts.disableThrowWhenEmpty;
    return {
        pattern,
        // @ts-ignore
        options: opts,
    };
}
exports.handleArgs = handleArgs;
function _error(data, Err = Error) {
    let e = new Err(data.message || data._data);
    // @ts-ignore
    e._data = data._data;
    // @ts-ignore
    return e;
}
exports._error = _error;
exports.default = globSearch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7Ozs7O0FBRUgsd0RBQTBCO0FBQzFCLHNFQUE0RDtBQUM1RCx3REFBZ0M7QUFDaEMsZ0RBQXlCO0FBQ3pCLCtCQUE4QjtBQUM5QixvRkFBb0Q7QUFHcEQscUVBQTRDO0FBRTVDLFNBQWdCLFVBQVUsQ0FBK0IsT0FBMEIsRUFBRSxPQUFxQjtJQUV6RyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUV0RCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsT0FBd0MsQ0FBQztJQUU5RCxPQUFPLElBQUksa0JBQVEsQ0FBa0IsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUU5RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQXVCLENBQUM7UUFFNUQsSUFBSSxPQUFPLEdBQWEsRUFBRSxDQUFDO1FBQzNCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUVoQixJQUFJLE1BQU0sa0JBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQzVCO1lBQ0MsT0FBTyxJQUFJLEVBQ1g7Z0JBQ0MsSUFBSSxHQUFHLEtBQUssR0FBRyxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQy9CO29CQUNDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN4QjtnQkFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUVsQixtQkFBbUI7Z0JBRW5CLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO2dCQUVm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O1FBQ0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxnQ0FBYyxDQUFDO0tBQ3BDO1NBQ0ksSUFBSSxJQUFJLENBQUMsYUFBYSxFQUMzQjtRQUNDLGFBQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM3QztTQUVEO1FBQ0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7S0FDekI7SUFFRCxJQUFJLENBQUMscUJBQXFCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztJQUUxRCxPQUFPO1FBQ04sT0FBTztRQUNQLGFBQWE7UUFDYixPQUFPLEVBQUUsSUFBSTtLQUNiLENBQUE7QUFDRixDQUFDO0FBckhELGdDQXFIQztBQUVELFNBQWdCLE1BQU0sQ0FBaUMsSUFJdEQsRUFBRSxNQUE0QixLQUFLO0lBSW5DLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVDLGFBQWE7SUFDYixDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDckIsYUFBYTtJQUNiLE9BQU8sQ0FBQyxDQUFDO0FBQ1YsQ0FBQztBQWJELHdCQWFDO0FBRUQsa0JBQWUsVUFBVSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOC8xMi80LzAwNC5cbiAqL1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IEZhc3RHbG9iLCB7IEVudHJ5SXRlbSB9IGZyb20gJ0BibHVlbG92ZXJzL2Zhc3QtZ2xvYic7XG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IF9wYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZXhwZWN0IH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgbmF0dXJhbENvbXBhcmUgZnJvbSAnc3RyaW5nLW5hdHVyYWwtY29tcGFyZSc7XG5pbXBvcnQgcGtnRGlyIGZyb20gJ3BrZy1kaXInO1xuaW1wb3J0IHsgSVRTT3ZlcndyaXRlLCBJVFNSZXNvbHZhYmxlIH0gZnJvbSAndHMtdHlwZSc7XG5pbXBvcnQgZmluZFJvb3QgZnJvbSAnQHlhcm4tdG9vbC9maW5kLXJvb3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2xvYlNlYXJjaDxUIGV4dGVuZHMgRW50cnlJdGVtID0gc3RyaW5nPihwYXR0ZXJuOiBzdHJpbmcgfCBzdHJpbmdbXSwgb3B0aW9ucz86IElPcHRpb25zPFQ+KVxue1xuXHQoeyBwYXR0ZXJuLCBvcHRpb25zIH0gPSBoYW5kbGVBcmdzKHBhdHRlcm4sIG9wdGlvbnMpKTtcblxuXHRjb25zdCBwYXRoID0gb3B0aW9ucy5wYXRoTGliIGFzIElPcHRpb25zUnVudGltZTxUPltcInBhdGhMaWJcIl07XG5cblx0cmV0dXJuIG5ldyBCbHVlYmlyZDxJUmV0dXJuVmFsdWU8VD4+KGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+XG5cdHtcblx0XHRsZXQgY3dkID0gcGF0aC5ub3JtYWxpemUob3B0aW9ucy5jd2QpO1xuXHRcdGxldCBvcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucykgYXMgSU9wdGlvbnNSdW50aW1lPFQ+O1xuXG5cdFx0bGV0IGhpc3Rvcnk6IHN0cmluZ1tdID0gW107XG5cdFx0bGV0IGJvb2wgPSB0cnVlO1xuXG5cdFx0aWYgKGF3YWl0IGZzLnBhdGhFeGlzdHMoY3dkKSlcblx0XHR7XG5cdFx0XHR3aGlsZSAoYm9vbClcblx0XHRcdHtcblx0XHRcdFx0aWYgKGN3ZCA9PT0gJy4nIHx8IGN3ZCA9PT0gJy4uJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGN3ZCA9IHBhdGgucmVzb2x2ZShjd2QpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aGlzdG9yeS5wdXNoKGN3ZCk7XG5cblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhjd2QpO1xuXG5cdFx0XHRcdG9wdHMuY3dkID0gY3dkO1xuXG5cdFx0XHRcdGxldCB2YWx1ZSA9IGF3YWl0IEZhc3RHbG9iXG5cdFx0XHRcdFx0LmFzeW5jPFQ+KHBhdHRlcm4sIG9wdHMpXG5cdFx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChlKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGJvb2wgPSBmYWxzZTtcblxuXHRcdFx0XHRcdFx0ZS5fZGF0YSA9IHtcblx0XHRcdFx0XHRcdFx0Y3dkLFxuXHRcdFx0XHRcdFx0XHRwYXR0ZXJuOiBwYXR0ZXJuIGFzIHN0cmluZ1tdLFxuXHRcdFx0XHRcdFx0XHRvcHRpb25zOiBvcHRzLFxuXHRcdFx0XHRcdFx0XHRoaXN0b3J5LFxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xuXHRcdFx0XHRcdH0pIGFzIFRbXVxuXHRcdFx0XHQ7XG5cblx0XHRcdFx0aWYgKCFib29sKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHZhbHVlLmxlbmd0aClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmIChvcHRzLnNvcnRDb21wYXJlRm4pXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dmFsdWUuc29ydChvcHRzLnNvcnRDb21wYXJlRm4pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJlc29sdmUoe1xuXHRcdFx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdFx0XHRjd2QsXG5cdFx0XHRcdFx0XHRwYXR0ZXJuOiBwYXR0ZXJuIGFzIHN0cmluZ1tdLFxuXHRcdFx0XHRcdFx0b3B0aW9uczogb3B0cyxcblx0XHRcdFx0XHRcdGhpc3RvcnksXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vY29uc29sZS5sb2coY3dkKTtcblxuXHRcdFx0XHRpZiAob3B0cy5zdG9wUGF0aC5pbmNsdWRlcyhjd2QpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly9ib29sID0gZmFsc2U7XG5cdFx0XHRcdFx0cmVqZWN0RmFpbChgc3RvcCBzZWFyY2ggYXQgJHtjd2R9YCk7XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8qXG5cdFx0XHRcdGxldCB0ID0gcGF0aC5yZXNvbHZlKGN3ZCk7XG5cblx0XHRcdFx0b3B0cy5pZ25vcmUucHVzaChjd2QgKyBwYXRoLnNlcCk7XG5cdFx0XHRcdG9wdHMuaWdub3JlLnB1c2goY3dkICsgcGF0aC5zZXAgKyAnKionKTtcblxuXHRcdFx0XHRpZiAodCAhPSBjd2QpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRvcHRzLmlnbm9yZS5wdXNoKHQgKyBwYXRoLnNlcCk7XG5cdFx0XHRcdFx0b3B0cy5pZ25vcmUucHVzaCh0ICsgcGF0aC5zZXAgKyAnKionKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQqL1xuXG5cdFx0XHRcdGN3ZCA9IHBhdGgucmVzb2x2ZShjd2QsICcuLicpO1xuXG5cdFx0XHRcdGlmIChjd2QgPT09IG9wdHMuY3dkKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly9ib29sID0gZmFsc2U7XG5cdFx0XHRcdFx0cmVqZWN0RmFpbChgdGhlcmUgaXMgbm8gYW55IHBhcmVudCBwYXRoOiAke2N3ZH1gKTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChib29sKVxuXHRcdFx0e1xuXHRcdFx0XHRyZWplY3RGYWlsKGB1bmtub3cgZXJyb3JgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHJlamVjdEZhaWwoYHBhdGggbm90IGV4aXN0cyAke2N3ZH1gKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiByZWplY3RGYWlsKG1lc3NhZ2U6IHN0cmluZylcblx0XHR7XG5cdFx0XHRib29sID0gZmFsc2U7XG5cblx0XHRcdGlmIChvcHRzLmRpc2FibGVUaHJvd1doZW5FbXB0eSlcblx0XHRcdHtcblx0XHRcdFx0cmVzb2x2ZSh7XG5cdFx0XHRcdFx0dmFsdWU6IFtdLFxuXHRcdFx0XHRcdGN3ZCxcblx0XHRcdFx0XHRwYXR0ZXJuOiBwYXR0ZXJuIGFzIHN0cmluZ1tdLFxuXHRcdFx0XHRcdG9wdGlvbnM6IG9wdHMsXG5cdFx0XHRcdFx0aGlzdG9yeSxcblx0XHRcdFx0XHRlcnJEYXRhOiB7XG5cdFx0XHRcdFx0XHRtZXNzYWdlLFxuXHRcdFx0XHRcdFx0X2RhdGE6IHtcblx0XHRcdFx0XHRcdFx0Y3dkLFxuXHRcdFx0XHRcdFx0XHRwYXR0ZXJuOiBwYXR0ZXJuIGFzIHN0cmluZ1tdLFxuXHRcdFx0XHRcdFx0XHRvcHRpb25zOiBvcHRzLFxuXHRcdFx0XHRcdFx0XHRoaXN0b3J5LFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdHJlamVjdChfZXJyb3Ioe1xuXHRcdFx0XHRcdG1lc3NhZ2UsXG5cdFx0XHRcdFx0X2RhdGE6IHtcblx0XHRcdFx0XHRcdGN3ZCxcblx0XHRcdFx0XHRcdHBhdHRlcm46IHBhdHRlcm4gYXMgc3RyaW5nW10sXG5cdFx0XHRcdFx0XHRvcHRpb25zOiBvcHRzLFxuXHRcdFx0XHRcdFx0aGlzdG9yeSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnbG9iU2VhcmNoU3luYzxUIGV4dGVuZHMgRW50cnlJdGVtID0gc3RyaW5nPihwYXR0ZXJuOiBzdHJpbmcgfCBzdHJpbmdbXSwgb3B0aW9ucz86IElPcHRpb25zPFQ+KTogSVJldHVyblZhbHVlU3luYzxUPlxue1xuXHQoeyBwYXR0ZXJuLCBvcHRpb25zIH0gPSBoYW5kbGVBcmdzKHBhdHRlcm4sIG9wdGlvbnMpKTtcblxuXHRjb25zdCBwYXRoID0gb3B0aW9ucy5wYXRoTGliIGFzIElPcHRpb25zUnVudGltZTxUPltcInBhdGhMaWJcIl07XG5cblx0bGV0IGN3ZCA9IHBhdGgubm9ybWFsaXplKG9wdGlvbnMuY3dkKTtcblx0bGV0IG9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSBhcyBJT3B0aW9uc1J1bnRpbWU8VD47XG5cblx0bGV0IGhpc3Rvcnk6IHN0cmluZ1tdID0gW107XG5cdGxldCBib29sID0gdHJ1ZTtcblxuXHRpZiAoZnMucGF0aEV4aXN0c1N5bmMoY3dkKSlcblx0e1xuXHRcdHdoaWxlIChib29sKVxuXHRcdHtcblx0XHRcdGlmIChjd2QgPT09ICcuJyB8fCBjd2QgPT09ICcuLicpXG5cdFx0XHR7XG5cdFx0XHRcdGN3ZCA9IHBhdGgucmVzb2x2ZShjd2QpO1xuXHRcdFx0fVxuXG5cdFx0XHRoaXN0b3J5LnB1c2goY3dkKTtcblxuXHRcdFx0Ly9jb25zb2xlLmxvZyhjd2QpO1xuXG5cdFx0XHRvcHRzLmN3ZCA9IGN3ZDtcblxuXHRcdFx0bGV0IHZhbHVlOiBUW107XG5cblx0XHRcdHRyeVxuXHRcdFx0e1xuXHRcdFx0XHR2YWx1ZSA9IEZhc3RHbG9iLnN5bmM8VD4ocGF0dGVybiwgb3B0cyk7XG5cdFx0XHR9XG5cdFx0XHRjYXRjaCAoZSlcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHJlamVjdEZhaWwoZSlcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFib29sKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICh2YWx1ZS5sZW5ndGgpXG5cdFx0XHR7XG5cdFx0XHRcdGlmIChvcHRzLnNvcnRDb21wYXJlRm4pXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR2YWx1ZS5zb3J0KG9wdHMuc29ydENvbXBhcmVGbik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gcmVzb2x2ZSh7XG5cdFx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdFx0Y3dkLFxuXHRcdFx0XHRcdHBhdHRlcm4sXG5cdFx0XHRcdFx0b3B0aW9uczogb3B0cyxcblx0XHRcdFx0XHRoaXN0b3J5LFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Ly9jb25zb2xlLmxvZyhjd2QpO1xuXG5cdFx0XHRpZiAob3B0cy5zdG9wUGF0aC5pbmNsdWRlcyhjd2QpKVxuXHRcdFx0e1xuXHRcdFx0XHQvL2Jvb2wgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuIHJlamVjdEZhaWwoYHN0b3Agc2VhcmNoIGF0ICR7Y3dkfWApO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHQvKlxuXHRcdFx0bGV0IHQgPSBwYXRoLnJlc29sdmUoY3dkKTtcblxuXHRcdFx0b3B0cy5pZ25vcmUucHVzaChjd2QgKyBwYXRoLnNlcCk7XG5cdFx0XHRvcHRzLmlnbm9yZS5wdXNoKGN3ZCArIHBhdGguc2VwICsgJyoqJyk7XG5cblx0XHRcdGlmICh0ICE9IGN3ZClcblx0XHRcdHtcblx0XHRcdFx0b3B0cy5pZ25vcmUucHVzaCh0ICsgcGF0aC5zZXApO1xuXHRcdFx0XHRvcHRzLmlnbm9yZS5wdXNoKHQgKyBwYXRoLnNlcCArICcqKicpO1xuXHRcdFx0fVxuXHRcdFx0Ki9cblxuXHRcdFx0Y3dkID0gcGF0aC5yZXNvbHZlKGN3ZCwgJy4uJyk7XG5cblx0XHRcdGlmIChjd2QgPT09IG9wdHMuY3dkKVxuXHRcdFx0e1xuXHRcdFx0XHQvL2Jvb2wgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuIHJlamVjdEZhaWwoYHRoZXJlIGlzIG5vIGFueSBwYXJlbnQgcGF0aDogJHtjd2R9YCk7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdHJldHVybiByZWplY3RGYWlsKGBwYXRoIG5vdCBleGlzdHMgJHtjd2R9YCk7XG5cdH1cblxuXHRyZXR1cm4gcmVqZWN0RmFpbChgdW5rbm93IGVycm9yYCk7XG5cblx0ZnVuY3Rpb24gcmVqZWN0RmFpbDxFIGV4dGVuZHMgc3RyaW5nIHwgRXJyb3I+KG1lc3NhZ2U6IEUpXG5cdHtcblx0XHRib29sID0gZmFsc2U7XG5cblx0XHRpZiAobWVzc2FnZSBpbnN0YW5jZW9mIEVycm9yKVxuXHRcdHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdG1lc3NhZ2UuX2RhdGEgPSB7XG5cdFx0XHRcdGN3ZCxcblx0XHRcdFx0cGF0dGVybixcblx0XHRcdFx0b3B0aW9uczogb3B0cyxcblx0XHRcdFx0aGlzdG9yeSxcblx0XHRcdH07XG5cblx0XHRcdHRocm93IG1lc3NhZ2U7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdHMuZGlzYWJsZVRocm93V2hlbkVtcHR5KVxuXHRcdHtcblx0XHRcdHJldHVybiByZXNvbHZlKHtcblx0XHRcdFx0dmFsdWU6IFtdLFxuXHRcdFx0XHRjd2QsXG5cdFx0XHRcdHBhdHRlcm46IHBhdHRlcm4gYXMgc3RyaW5nW10sXG5cdFx0XHRcdG9wdGlvbnM6IG9wdHMsXG5cdFx0XHRcdGhpc3RvcnksXG5cdFx0XHRcdGVyckRhdGE6IHtcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0bWVzc2FnZSxcblx0XHRcdFx0XHRfZGF0YToge1xuXHRcdFx0XHRcdFx0Y3dkLFxuXHRcdFx0XHRcdFx0cGF0dGVybjogcGF0dGVybiBhcyBzdHJpbmdbXSxcblx0XHRcdFx0XHRcdG9wdGlvbnM6IG9wdHMsXG5cdFx0XHRcdFx0XHRoaXN0b3J5LFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdH0pXG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHR0aHJvdyBfZXJyb3Ioe1xuXHRcdFx0XHRtZXNzYWdlLFxuXHRcdFx0XHRfZGF0YToge1xuXHRcdFx0XHRcdGN3ZCxcblx0XHRcdFx0XHRwYXR0ZXJuOiBwYXR0ZXJuIGFzIHN0cmluZ1tdLFxuXHRcdFx0XHRcdG9wdGlvbnM6IG9wdHMsXG5cdFx0XHRcdFx0aGlzdG9yeSxcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gcmVzb2x2ZTxSIGV4dGVuZHMgSVJldHVyblZhbHVlPFQ+PihkYXRhOiBSKTogSVJldHVyblZhbHVlU3luYzxUPlxuXHR7XG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oZGF0YSwge1xuXG5cdFx0XHR0aGVuOiBmdW5jdGlvbiBmYWtlVGhlbihmbilcblx0XHRcdHtcblx0XHRcdFx0ZGVsZXRlIChkYXRhIGFzIGFueSBhcyBJUmV0dXJuVmFsdWVTeW5jPFQ+KS50aGVuO1xuXG5cdFx0XHRcdGxldCByZXQgPSBmbihkYXRhKTtcblxuXHRcdFx0XHRoYW5kbGVQcm9taXNlKHJldCwgZGF0YSk7XG5cblx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdH0sXG5cblx0XHRcdGNhdGNoOiBmdW5jdGlvbiBmYWtlQ2F0Y2goZm4pXG5cdFx0XHR7XG5cdFx0XHRcdGRlbGV0ZSAoZGF0YSBhcyBhbnkgYXMgSVJldHVyblZhbHVlU3luYzxUPikuY2F0Y2g7XG5cblx0XHRcdFx0bGV0IGUgPSBudWxsO1xuXG5cdFx0XHRcdGlmIChkYXRhLmVyckRhdGEpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRlID0gX2Vycm9yKGRhdGEuZXJyRGF0YSk7XG5cblx0XHRcdFx0XHRsZXQgcmV0ID0gZm4oZSk7XG5cblx0XHRcdFx0XHRoYW5kbGVQcm9taXNlKHJldCwgZGF0YSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBkYXRhXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHRhcDogZnVuY3Rpb24gZmFrZVRhcChmbilcblx0XHRcdHtcblx0XHRcdFx0ZGVsZXRlIChkYXRhIGFzIGFueSBhcyBJUmV0dXJuVmFsdWVTeW5jPFQ+KS50YXA7XG5cblx0XHRcdFx0bGV0IHJldCA9IGZuKGRhdGEpO1xuXG5cdFx0XHRcdGlmIChoYW5kbGVQcm9taXNlKHJldCwgZGF0YSkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gcmV0LnRoZW4oZnVuY3Rpb24gKClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9LFxuXHRcdFx0dGFwQ2F0Y2g6IGZ1bmN0aW9uIGZha2VUYXBDYXRjaChmbilcblx0XHRcdHtcblx0XHRcdFx0bGV0IGUgPSBudWxsO1xuXG5cdFx0XHRcdGRlbGV0ZSAoZGF0YSBhcyBhbnkgYXMgSVJldHVyblZhbHVlU3luYzxUPikudGFwQ2F0Y2g7XG5cblx0XHRcdFx0aWYgKGRhdGEuZXJyRGF0YSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGUgPSBfZXJyb3IoZGF0YS5lcnJEYXRhKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCByZXQgPSBmbihlKTtcblxuXHRcdFx0XHRpZiAoaGFuZGxlUHJvbWlzZShyZXQsIGRhdGEpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHJldC50aGVuKGZ1bmN0aW9uICgpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fSxcblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlUHJvbWlzZShyZXQsIGRhdGE6IElSZXR1cm5WYWx1ZVN5bmM8VD4gfCBJUmV0dXJuVmFsdWU8VD4pXG5cdHtcblx0XHRpZiAocmV0ICE9PSBkYXRhICYmIGlzUHJvbWlzZShyZXQpKVxuXHRcdHtcblx0XHRcdGRlbGV0ZSAoZGF0YSBhcyBhbnkgYXMgSVJldHVyblZhbHVlU3luYzxUPikudGFwO1xuXHRcdFx0ZGVsZXRlIChkYXRhIGFzIGFueSBhcyBJUmV0dXJuVmFsdWVTeW5jPFQ+KS50YXBDYXRjaDtcblx0XHRcdGRlbGV0ZSAoZGF0YSBhcyBhbnkgYXMgSVJldHVyblZhbHVlU3luYzxUPikudGhlbjtcblx0XHRcdGRlbGV0ZSAoZGF0YSBhcyBhbnkgYXMgSVJldHVyblZhbHVlU3luYzxUPikuY2F0Y2g7XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5leHBvcnQge1xuXHRnbG9iU2VhcmNoIGFzIGFzeW5jLFxuXHRnbG9iU2VhcmNoU3luYyBhcyBzeW5jLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElPcHRpb25zPFQgZXh0ZW5kcyBFbnRyeUl0ZW0+IGV4dGVuZHMgRmFzdEdsb2IuT3B0aW9uc1xue1xuXHRjd2Q/OiBzdHJpbmcsXG5cdGRlZXA/OiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIEBkZWZhdWx0IGN1cnJlbnQgcGFja2FnZSBwYXRoXG5cdCAqL1xuXHRzdG9wUGF0aD86IHN0cmluZyB8IHN0cmluZ1tdIHwgYm9vbGVhbjtcblxuXHQvKipcblx0ICogQGRlZmF1bHQgdHJ1ZVxuXHQgKi9cblx0Zm9sbG93U3ltbGlua2VkRGlyZWN0b3JpZXM/OiBib29sZWFuLFxuXG5cdHNvcnRDb21wYXJlRm4/OiBib29sZWFuIHwgKChhOiBULCBiOiBUKSA9PiBudW1iZXIpLFxuXG5cdGlnbm9yZT86IHN0cmluZ1tdLFxuXG5cdGRpc2FibGVUaHJvd1doZW5FbXB0eT86IGJvb2xlYW4sXG5cblx0cGF0aExpYj86IElQYXRoTGliQmFzZSxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmV0dXJuVmFsdWU8VCBleHRlbmRzIEVudHJ5SXRlbT5cbntcblx0dmFsdWU6IFRbXSxcblx0Y3dkOiBzdHJpbmcsXG5cblx0cGF0dGVybjogc3RyaW5nW10sXG5cdG9wdGlvbnM6IElPcHRpb25zUnVudGltZTxUPixcblx0aGlzdG9yeTogc3RyaW5nW10sXG5cblx0ZXJyRGF0YT86IFBhcnRpYWw8SVJldHVybkVycm9yPFQ+Pixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmV0dXJuVmFsdWVTeW5jPFQgZXh0ZW5kcyBFbnRyeUl0ZW0+IGV4dGVuZHMgSVJldHVyblZhbHVlPFQ+XG57XG5cdHRoZW48Uj4oZm46IChkYXRhOiBJUmV0dXJuVmFsdWVTeW5jPFQ+KSA9PiBSKTogUixcblx0Y2F0Y2g8Uj4oZm46IChlcnI6IElSZXR1cm5FcnJvcjxUPikgPT4gUik6IElSZXR1cm5WYWx1ZVN5bmM8VD4gJiBSLFxuXG5cdHRhcChmbjogKGRhdGE6IElSZXR1cm5WYWx1ZVN5bmM8VD4pID0+IGFueSk6IElSZXR1cm5WYWx1ZVN5bmM8VD4sXG5cdHRhcENhdGNoKGZuOiAoZXJyOiBJUmV0dXJuRXJyb3I8VD4pID0+IGFueSk6IElSZXR1cm5WYWx1ZVN5bmM8VD4sXG59XG5cbmV4cG9ydCB0eXBlIElPcHRpb25zUnVudGltZTxUIGV4dGVuZHMgRW50cnlJdGVtPiA9IElUU092ZXJ3cml0ZTxJT3B0aW9uczxUPiwge1xuXHRzb3J0Q29tcGFyZUZuPyhhOiBULCBiOiBUKTogbnVtYmVyLFxuXHRpZ25vcmU/OiBzdHJpbmdbXSxcblx0c3RvcFBhdGg/OiBzdHJpbmdbXTtcblxuXHQvL3BhdGhMaWI/OiBJUGF0aExpYkJhc2UgJiB0eXBlb2YgX3BhdGggJiB0eXBlb2YgX3VwYXRoLFxufT5cblxuZXhwb3J0IGludGVyZmFjZSBJUGF0aExpYkJhc2Vcbntcblx0c2VwOiBzdHJpbmcsXG5cdG5vcm1hbGl6ZShwYXRoOiBzdHJpbmcpOiBzdHJpbmc7XG5cdHJlc29sdmUoLi4ucGF0aHM6IHN0cmluZ1tdKTogc3RyaW5nO1xuXHRqb2luKC4uLnBhdGhzOiBzdHJpbmdbXSk6IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgSVJldHVybkVycm9yPFQgZXh0ZW5kcyBFbnRyeUl0ZW0sIEUgZXh0ZW5kcyBFcnJvciA9IEVycm9yPiA9IEUgJiB7XG5cdG1lc3NhZ2U6IHN0cmluZyxcblx0X2RhdGE6IHtcblx0XHRjd2Q6IHN0cmluZyxcblxuXHRcdHBhdHRlcm46IHN0cmluZ1tdLFxuXHRcdG9wdGlvbnM6IElPcHRpb25zUnVudGltZTxUPixcblxuXHRcdGhpc3Rvcnk6IHN0cmluZ1tdLFxuXHR9LFxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9taXNlPFQgZXh0ZW5kcyBQcm9taXNlPGFueT4+KHJldDogVCk6IHJldCBpcyBUXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9taXNlPFQgZXh0ZW5kcyBCbHVlYmlyZDxhbnk+PihyZXQ6IFQpOiByZXQgaXMgVFxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvbWlzZShyZXQpXG57XG5cdGlmIChCbHVlYmlyZC5pcyhyZXQpKVxuXHR7XG5cdFx0cmV0dXJuIHRydWVcblx0fVxuXHRlbHNlIGlmIChyZXQgaW5zdGFuY2VvZiBQcm9taXNlKVxuXHR7XG5cdFx0cmV0dXJuIHRydWVcblx0fVxuXG5cdHJldHVybiBmYWxzZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlQXJnczxUIGV4dGVuZHMgRW50cnlJdGVtID0gc3RyaW5nPihwYXR0ZXJuOiBzdHJpbmcgfCBzdHJpbmdbXSwgb3B0aW9ucz86IElPcHRpb25zPFQ+KToge1xuXHRwYXR0ZXJuOiBzdHJpbmdbXSxcblx0b3B0aW9uczogSU9wdGlvbnNSdW50aW1lPFQ+LFxufVxue1xuXHRpZiAodHlwZW9mIHBhdHRlcm4gPT09ICdzdHJpbmcnKVxuXHR7XG5cdFx0cGF0dGVybiA9IFtwYXR0ZXJuXTtcblx0fVxuXG5cdGV4cGVjdChwYXR0ZXJuKS5pcy5hbignYXJyYXknKTtcblxuXHRwYXR0ZXJuID0gcGF0dGVybi5maWx0ZXIodiA9PiB0eXBlb2YgdiA9PT0gJ3N0cmluZycgJiYgdiAhPT0gJycpO1xuXG5cdGV4cGVjdChwYXR0ZXJuKS5oYXZlLmxlbmd0aE9mLmd0KDApO1xuXG5cdGxldCBvcHRzID0gT2JqZWN0LmFzc2lnbih7XG5cdFx0Zm9sbG93U3ltbGlua2VkRGlyZWN0b3JpZXM6IHRydWUsXG5cdFx0bWFya0RpcmVjdG9yaWVzOiB0cnVlLFxuXHRcdHVuaXF1ZTogdHJ1ZSxcblx0XHRjd2Q6IHByb2Nlc3MuY3dkKCksXG5cdFx0Ly9zdG9wUGF0aDogW10sXG5cdFx0aWdub3JlOiBbXSxcblx0fSwgb3B0aW9ucyB8fCB7fSk7XG5cblx0ZXhwZWN0KG9wdHMuY3dkKS5pcy5hbignc3RyaW5nJyk7XG5cblx0b3B0cy5wYXRoTGliID0gb3B0cy5wYXRoTGliIHx8IF9wYXRoO1xuXHRjb25zdCBwYXRoID0gb3B0cy5wYXRoTGliIGFzIElPcHRpb25zUnVudGltZTxUPltcInBhdGhMaWJcIl07XG5cblx0ZXhwZWN0KHBhdGguam9pbikuaXMuYW4oJ2Z1bmN0aW9uJyk7XG5cdGV4cGVjdChwYXRoLnNlcCkuaXMuYW4oJ3N0cmluZycpO1xuXHRleHBlY3QocGF0aC5ub3JtYWxpemUpLmlzLmFuKCdmdW5jdGlvbicpO1xuXHRleHBlY3QocGF0aC5yZXNvbHZlKS5pcy5hbignZnVuY3Rpb24nKTtcblxuXHRsZXQgY3dkID0gcGF0aC5ub3JtYWxpemUob3B0cy5jd2QpO1xuXG5cdGlmIChjd2QgPT09ICcuJyB8fCBjd2QgPT09ICcuLicpXG5cdHtcblx0XHRjd2QgPSBwYXRoLnJlc29sdmUoY3dkKTtcblx0fVxuXG5cdG9wdHMuY3dkID0gY3dkO1xuXG5cdGlmIChvcHRzLnN0b3BQYXRoID09IG51bGwgfHwgb3B0cy5zdG9wUGF0aCA9PT0gdHJ1ZSlcblx0e1xuXHRcdGxldCB7IHJvb3QgfSA9IGZpbmRSb290KHtcblx0XHRcdGN3ZFxuXHRcdH0pO1xuXG5cdFx0b3B0cy5zdG9wUGF0aCA9IFtdO1xuXHRcdGlmIChyb290KVxuXHRcdHtcblx0XHRcdG9wdHMuc3RvcFBhdGgucHVzaChyb290KTtcblx0XHR9XG5cdH1cblx0ZWxzZSBpZiAodHlwZW9mIG9wdHMuc3RvcFBhdGggPT09ICdzdHJpbmcnKVxuXHR7XG5cdFx0b3B0cy5zdG9wUGF0aCA9IFtvcHRzLnN0b3BQYXRoXTtcblx0fVxuXHRlbHNlIGlmIChvcHRzLnN0b3BQYXRoID09PSBmYWxzZSlcblx0e1xuXHRcdG9wdHMuc3RvcFBhdGggPSBbXTtcblx0fVxuXG5cdGV4cGVjdChvcHRzLnN0b3BQYXRoKS5pcy5hbignYXJyYXknKTtcblxuXHRvcHRzLnN0b3BQYXRoID0gb3B0cy5zdG9wUGF0aC5tYXAodiA9PlxuXHR7XG5cblx0XHRpZiAodHlwZW9mIHYgIT09ICdzdHJpbmcnKVxuXHRcdHtcblx0XHRcdGV4cGVjdCh2LCBgb3B0aW9ucy5zdG9wUGF0aCBtdXN0IGlzIHN0cmluZyBvciBzdHJpbmdbXWApLmlzLmFuKCdzdHJpbmcnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGF0aC5ub3JtYWxpemUodilcblx0fSk7XG5cblx0aWYgKG9wdHMuaWdub3JlID09IG51bGwpXG5cdHtcblx0XHRvcHRzLmlnbm9yZSA9IFtdO1xuXHR9XG5cdGVsc2UgaWYgKHR5cGVvZiBvcHRzLmlnbm9yZSA9PT0gJ3N0cmluZycpXG5cdHtcblx0XHRvcHRzLmlnbm9yZSA9IFtvcHRzLmlnbm9yZV07XG5cdH1cblxuXHRleHBlY3Qob3B0cy5pZ25vcmUpLmlzLmFuKCdhcnJheScpO1xuXG5cdG9wdHMuaWdub3JlLmZvckVhY2godiA9PlxuXHR7XG5cdFx0aWYgKHR5cGVvZiB2ICE9PSAnc3RyaW5nJylcblx0XHR7XG5cdFx0XHRleHBlY3QodiwgYG9wdGlvbnMuaWdub3JlIG11c3QgaXMgc3RyaW5nW11gKS5pcy5hbignc3RyaW5nJyk7XG5cdFx0fVxuXHR9KTtcblxuXHRpZiAob3B0cy5zb3J0Q29tcGFyZUZuID09PSB0cnVlIHx8IG9wdHMuc29ydENvbXBhcmVGbiA9PSBudWxsKVxuXHR7XG5cdFx0b3B0cy5zb3J0Q29tcGFyZUZuID0gbmF0dXJhbENvbXBhcmU7XG5cdH1cblx0ZWxzZSBpZiAob3B0cy5zb3J0Q29tcGFyZUZuKVxuXHR7XG5cdFx0ZXhwZWN0KG9wdHMuc29ydENvbXBhcmVGbikuaXMuYW4oJ2Z1bmN0aW9uJyk7XG5cdH1cblx0ZWxzZVxuXHR7XG5cdFx0b3B0cy5zb3J0Q29tcGFyZUZuID0gbnVsbFxuXHR9XG5cblx0b3B0cy5kaXNhYmxlVGhyb3dXaGVuRW1wdHkgPSAhIW9wdHMuZGlzYWJsZVRocm93V2hlbkVtcHR5O1xuXG5cdHJldHVybiB7XG5cdFx0cGF0dGVybixcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0b3B0aW9uczogb3B0cyxcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX2Vycm9yPEUgZXh0ZW5kcyBFcnJvciwgRCBleHRlbmRzIGFueT4oZGF0YToge1xuXHRtZXNzYWdlPzogc3RyaW5nIHwgYW55LFxuXHRfZGF0YT86IEQsXG5cdC8vIEB0cy1pZ25vcmVcbn0sIEVycjogKG5ldyAoLi4uYXJncykgPT4gRSkgPSBFcnJvcik6IEUgJiB7XG5cdF9kYXRhPzogRFxufVxue1xuXHRsZXQgZSA9IG5ldyBFcnIoZGF0YS5tZXNzYWdlIHx8IGRhdGEuX2RhdGEpO1xuXHQvLyBAdHMtaWdub3JlXG5cdGUuX2RhdGEgPSBkYXRhLl9kYXRhO1xuXHQvLyBAdHMtaWdub3JlXG5cdHJldHVybiBlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnbG9iU2VhcmNoXG4iXX0=