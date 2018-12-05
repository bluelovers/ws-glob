/**
 * Created by user on 2018/12/4/004.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const FastGlob = require("fast-glob");
const Bluebird = require("bluebird");
const _path = require("path");
const chai_1 = require("chai");
const naturalCompare = require("string-natural-compare");
const pkgDir = require("pkg-dir");
function globSearch(pattern, options) {
    ({ pattern, options } = handleArgs(pattern, options));
    const path = options.pathLib;
    return new Bluebird(async (resolve, reject) => {
        let cwd = _path.normalize(options.cwd);
        let opts = Object.assign({}, options);
        let history = [];
        let bool = true;
        if (await fs.pathExists(cwd)) {
            while (bool) {
                if (cwd === '.' || cwd === '..') {
                    cwd = path.resolve(cwd);
                }
                history.push(cwd);
                //console.log(cwd);
                opts.cwd = cwd;
                let value = await FastGlob
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
    let cwd = _path.normalize(options.cwd);
    let opts = Object.assign({}, options);
    let history = [];
    let bool = true;
    if (fs.pathExistsSync(cwd)) {
        while (bool) {
            if (cwd === '.' || cwd === '..') {
                cwd = path.resolve(cwd);
            }
            history.push(cwd);
            //console.log(cwd);
            opts.cwd = cwd;
            let value;
            try {
                value = FastGlob.sync(pattern, opts);
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
    if (Bluebird.is(ret)) {
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
    opts.pathLib = opts.pathLib || _path;
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
        let root = pkgDir.sync(cwd);
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
        opts.sortCompareFn = naturalCompare;
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
const GlobSearch = require("./index");
exports.default = GlobSearch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRzs7QUFFSCwrQkFBZ0M7QUFDaEMsc0NBQXVDO0FBQ3ZDLHFDQUFzQztBQUN0Qyw4QkFBK0I7QUFHL0IsK0JBQThCO0FBQzlCLHlEQUEwRDtBQUMxRCxrQ0FBbUM7QUFHbkMsU0FBZ0IsVUFBVSxDQUErQixPQUEwQixFQUFFLE9BQXFCO0lBRXpHLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRXRELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUF3QyxDQUFDO0lBRTlELE9BQU8sSUFBSSxRQUFRLENBQWtCLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFFOUQsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUF1QixDQUFDO1FBRTVELElBQUksT0FBTyxHQUFhLEVBQUUsQ0FBQztRQUMzQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFFaEIsSUFBSSxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQzVCO1lBQ0MsT0FBTyxJQUFJLEVBQ1g7Z0JBQ0MsSUFBSSxHQUFHLEtBQUssR0FBRyxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQy9CO29CQUNDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN4QjtnQkFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUVsQixtQkFBbUI7Z0JBRW5CLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO2dCQUVmLElBQUks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R0FBRyxjQUFjLENBQUM7S0FDcEM7U0FDSSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQzNCO1FBQ0MsYUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzdDO1NBRUQ7UUFDQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtLQUN6QjtJQUVELElBQUksQ0FBQyxxQkFBcUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDO0lBRTFELE9BQU87UUFDTixPQUFPO1FBQ1AsYUFBYTtRQUNiLE9BQU8sRUFBRSxJQUFJO0tBQ2IsQ0FBQTtBQUNGLENBQUM7QUFwSEQsZ0NBb0hDO0FBRUQsU0FBZ0IsTUFBTSxDQUFpQyxJQUl0RCxFQUFFLE1BQTRCLEtBQUs7SUFJbkMsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUMsYUFBYTtJQUNiLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNyQixhQUFhO0lBQ2IsT0FBTyxDQUFDLENBQUM7QUFDVixDQUFDO0FBYkQsd0JBYUM7QUFFRCxzQ0FBdUM7QUFDdkMsa0JBQWUsVUFBVSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOC8xMi80LzAwNC5cbiAqL1xuXG5pbXBvcnQgZnMgPSByZXF1aXJlKCdmcy1leHRyYScpO1xuaW1wb3J0IEZhc3RHbG9iID0gcmVxdWlyZSgnZmFzdC1nbG9iJyk7XG5pbXBvcnQgQmx1ZWJpcmQgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xuaW1wb3J0IF9wYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuaW1wb3J0IF91cGF0aCA9IHJlcXVpcmUoJ3VwYXRoMicpO1xuaW1wb3J0IHsgRW50cnlJdGVtIH0gZnJvbSAnZmFzdC1nbG9iL291dC90eXBlcy9lbnRyaWVzJztcbmltcG9ydCB7IGV4cGVjdCB9IGZyb20gJ2NoYWknO1xuaW1wb3J0IG5hdHVyYWxDb21wYXJlID0gcmVxdWlyZSgnc3RyaW5nLW5hdHVyYWwtY29tcGFyZScpO1xuaW1wb3J0IHBrZ0RpciA9IHJlcXVpcmUoJ3BrZy1kaXInKTtcbmltcG9ydCB7IElUU092ZXJ3cml0ZSwgSVRTUmVzb2x2YWJsZSB9IGZyb20gJ3RzLXR5cGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2xvYlNlYXJjaDxUIGV4dGVuZHMgRW50cnlJdGVtID0gc3RyaW5nPihwYXR0ZXJuOiBzdHJpbmcgfCBzdHJpbmdbXSwgb3B0aW9ucz86IElPcHRpb25zPFQ+KVxue1xuXHQoeyBwYXR0ZXJuLCBvcHRpb25zIH0gPSBoYW5kbGVBcmdzKHBhdHRlcm4sIG9wdGlvbnMpKTtcblxuXHRjb25zdCBwYXRoID0gb3B0aW9ucy5wYXRoTGliIGFzIElPcHRpb25zUnVudGltZTxUPltcInBhdGhMaWJcIl07XG5cblx0cmV0dXJuIG5ldyBCbHVlYmlyZDxJUmV0dXJuVmFsdWU8VD4+KGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+XG5cdHtcblx0XHRsZXQgY3dkID0gX3BhdGgubm9ybWFsaXplKG9wdGlvbnMuY3dkKTtcblx0XHRsZXQgb3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpIGFzIElPcHRpb25zUnVudGltZTxUPjtcblxuXHRcdGxldCBoaXN0b3J5OiBzdHJpbmdbXSA9IFtdO1xuXHRcdGxldCBib29sID0gdHJ1ZTtcblxuXHRcdGlmIChhd2FpdCBmcy5wYXRoRXhpc3RzKGN3ZCkpXG5cdFx0e1xuXHRcdFx0d2hpbGUgKGJvb2wpXG5cdFx0XHR7XG5cdFx0XHRcdGlmIChjd2QgPT09ICcuJyB8fCBjd2QgPT09ICcuLicpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRjd2QgPSBwYXRoLnJlc29sdmUoY3dkKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGhpc3RvcnkucHVzaChjd2QpO1xuXG5cdFx0XHRcdC8vY29uc29sZS5sb2coY3dkKTtcblxuXHRcdFx0XHRvcHRzLmN3ZCA9IGN3ZDtcblxuXHRcdFx0XHRsZXQgdmFsdWUgPSBhd2FpdCBGYXN0R2xvYlxuXHRcdFx0XHRcdC5hc3luYzxUPihwYXR0ZXJuLCBvcHRzKVxuXHRcdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAoZSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRib29sID0gZmFsc2U7XG5cblx0XHRcdFx0XHRcdGUuX2RhdGEgPSB7XG5cdFx0XHRcdFx0XHRcdGN3ZCxcblx0XHRcdFx0XHRcdFx0cGF0dGVybjogcGF0dGVybiBhcyBzdHJpbmdbXSxcblx0XHRcdFx0XHRcdFx0b3B0aW9uczogb3B0cyxcblx0XHRcdFx0XHRcdFx0aGlzdG9yeSxcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRcdHJlamVjdChlKTtcblx0XHRcdFx0XHR9KSBhcyBUW11cblx0XHRcdFx0O1xuXG5cdFx0XHRcdGlmICghYm9vbClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2YWx1ZS5sZW5ndGgpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAob3B0cy5zb3J0Q29tcGFyZUZuKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHZhbHVlLnNvcnQob3B0cy5zb3J0Q29tcGFyZUZuKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXNvbHZlKHtcblx0XHRcdFx0XHRcdHZhbHVlLFxuXHRcdFx0XHRcdFx0Y3dkLFxuXHRcdFx0XHRcdFx0cGF0dGVybjogcGF0dGVybiBhcyBzdHJpbmdbXSxcblx0XHRcdFx0XHRcdG9wdGlvbnM6IG9wdHMsXG5cdFx0XHRcdFx0XHRoaXN0b3J5LFxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKGN3ZCk7XG5cblx0XHRcdFx0aWYgKG9wdHMuc3RvcFBhdGguaW5jbHVkZXMoY3dkKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vYm9vbCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJlamVjdEZhaWwoYHN0b3Agc2VhcmNoIGF0ICR7Y3dkfWApO1xuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvKlxuXHRcdFx0XHRsZXQgdCA9IHBhdGgucmVzb2x2ZShjd2QpO1xuXG5cdFx0XHRcdG9wdHMuaWdub3JlLnB1c2goY3dkICsgcGF0aC5zZXApO1xuXHRcdFx0XHRvcHRzLmlnbm9yZS5wdXNoKGN3ZCArIHBhdGguc2VwICsgJyoqJyk7XG5cblx0XHRcdFx0aWYgKHQgIT0gY3dkKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0b3B0cy5pZ25vcmUucHVzaCh0ICsgcGF0aC5zZXApO1xuXHRcdFx0XHRcdG9wdHMuaWdub3JlLnB1c2godCArIHBhdGguc2VwICsgJyoqJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ki9cblxuXHRcdFx0XHRjd2QgPSBwYXRoLnJlc29sdmUoY3dkLCAnLi4nKTtcblxuXHRcdFx0XHRpZiAoY3dkID09PSBvcHRzLmN3ZClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdC8vYm9vbCA9IGZhbHNlO1xuXHRcdFx0XHRcdHJlamVjdEZhaWwoYHRoZXJlIGlzIG5vIGFueSBwYXJlbnQgcGF0aDogJHtjd2R9YCk7XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoYm9vbClcblx0XHRcdHtcblx0XHRcdFx0cmVqZWN0RmFpbChgdW5rbm93IGVycm9yYCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRyZWplY3RGYWlsKGBwYXRoIG5vdCBleGlzdHMgJHtjd2R9YCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmVqZWN0RmFpbChtZXNzYWdlOiBzdHJpbmcpXG5cdFx0e1xuXHRcdFx0Ym9vbCA9IGZhbHNlO1xuXG5cdFx0XHRpZiAob3B0cy5kaXNhYmxlVGhyb3dXaGVuRW1wdHkpXG5cdFx0XHR7XG5cdFx0XHRcdHJlc29sdmUoe1xuXHRcdFx0XHRcdHZhbHVlOiBbXSxcblx0XHRcdFx0XHRjd2QsXG5cdFx0XHRcdFx0cGF0dGVybjogcGF0dGVybiBhcyBzdHJpbmdbXSxcblx0XHRcdFx0XHRvcHRpb25zOiBvcHRzLFxuXHRcdFx0XHRcdGhpc3RvcnksXG5cdFx0XHRcdFx0ZXJyRGF0YToge1xuXHRcdFx0XHRcdFx0bWVzc2FnZSxcblx0XHRcdFx0XHRcdF9kYXRhOiB7XG5cdFx0XHRcdFx0XHRcdGN3ZCxcblx0XHRcdFx0XHRcdFx0cGF0dGVybjogcGF0dGVybiBhcyBzdHJpbmdbXSxcblx0XHRcdFx0XHRcdFx0b3B0aW9uczogb3B0cyxcblx0XHRcdFx0XHRcdFx0aGlzdG9yeSxcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9KVxuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRyZWplY3QoX2Vycm9yKHtcblx0XHRcdFx0XHRtZXNzYWdlLFxuXHRcdFx0XHRcdF9kYXRhOiB7XG5cdFx0XHRcdFx0XHRjd2QsXG5cdFx0XHRcdFx0XHRwYXR0ZXJuOiBwYXR0ZXJuIGFzIHN0cmluZ1tdLFxuXHRcdFx0XHRcdFx0b3B0aW9uczogb3B0cyxcblx0XHRcdFx0XHRcdGhpc3RvcnksXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2xvYlNlYXJjaFN5bmM8VCBleHRlbmRzIEVudHJ5SXRlbSA9IHN0cmluZz4ocGF0dGVybjogc3RyaW5nIHwgc3RyaW5nW10sIG9wdGlvbnM/OiBJT3B0aW9uczxUPik6IElSZXR1cm5WYWx1ZVN5bmM8VD5cbntcblx0KHsgcGF0dGVybiwgb3B0aW9ucyB9ID0gaGFuZGxlQXJncyhwYXR0ZXJuLCBvcHRpb25zKSk7XG5cblx0Y29uc3QgcGF0aCA9IG9wdGlvbnMucGF0aExpYiBhcyBJT3B0aW9uc1J1bnRpbWU8VD5bXCJwYXRoTGliXCJdO1xuXG5cdGxldCBjd2QgPSBfcGF0aC5ub3JtYWxpemUob3B0aW9ucy5jd2QpO1xuXHRsZXQgb3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpIGFzIElPcHRpb25zUnVudGltZTxUPjtcblxuXHRsZXQgaGlzdG9yeTogc3RyaW5nW10gPSBbXTtcblx0bGV0IGJvb2wgPSB0cnVlO1xuXG5cdGlmIChmcy5wYXRoRXhpc3RzU3luYyhjd2QpKVxuXHR7XG5cdFx0d2hpbGUgKGJvb2wpXG5cdFx0e1xuXHRcdFx0aWYgKGN3ZCA9PT0gJy4nIHx8IGN3ZCA9PT0gJy4uJylcblx0XHRcdHtcblx0XHRcdFx0Y3dkID0gcGF0aC5yZXNvbHZlKGN3ZCk7XG5cdFx0XHR9XG5cblx0XHRcdGhpc3RvcnkucHVzaChjd2QpO1xuXG5cdFx0XHQvL2NvbnNvbGUubG9nKGN3ZCk7XG5cblx0XHRcdG9wdHMuY3dkID0gY3dkO1xuXG5cdFx0XHRsZXQgdmFsdWU6IFRbXTtcblxuXHRcdFx0dHJ5XG5cdFx0XHR7XG5cdFx0XHRcdHZhbHVlID0gRmFzdEdsb2Iuc3luYzxUPihwYXR0ZXJuLCBvcHRzKTtcblx0XHRcdH1cblx0XHRcdGNhdGNoIChlKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm4gcmVqZWN0RmFpbChlKVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWJvb2wpXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHZhbHVlLmxlbmd0aClcblx0XHRcdHtcblx0XHRcdFx0aWYgKG9wdHMuc29ydENvbXBhcmVGbilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHZhbHVlLnNvcnQob3B0cy5zb3J0Q29tcGFyZUZuKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiByZXNvbHZlKHtcblx0XHRcdFx0XHR2YWx1ZSxcblx0XHRcdFx0XHRjd2QsXG5cdFx0XHRcdFx0cGF0dGVybixcblx0XHRcdFx0XHRvcHRpb25zOiBvcHRzLFxuXHRcdFx0XHRcdGhpc3RvcnksXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHQvL2NvbnNvbGUubG9nKGN3ZCk7XG5cblx0XHRcdGlmIChvcHRzLnN0b3BQYXRoLmluY2x1ZGVzKGN3ZCkpXG5cdFx0XHR7XG5cdFx0XHRcdC8vYm9vbCA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm4gcmVqZWN0RmFpbChgc3RvcCBzZWFyY2ggYXQgJHtjd2R9YCk7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdC8qXG5cdFx0XHRsZXQgdCA9IHBhdGgucmVzb2x2ZShjd2QpO1xuXG5cdFx0XHRvcHRzLmlnbm9yZS5wdXNoKGN3ZCArIHBhdGguc2VwKTtcblx0XHRcdG9wdHMuaWdub3JlLnB1c2goY3dkICsgcGF0aC5zZXAgKyAnKionKTtcblxuXHRcdFx0aWYgKHQgIT0gY3dkKVxuXHRcdFx0e1xuXHRcdFx0XHRvcHRzLmlnbm9yZS5wdXNoKHQgKyBwYXRoLnNlcCk7XG5cdFx0XHRcdG9wdHMuaWdub3JlLnB1c2godCArIHBhdGguc2VwICsgJyoqJyk7XG5cdFx0XHR9XG5cdFx0XHQqL1xuXG5cdFx0XHRjd2QgPSBwYXRoLnJlc29sdmUoY3dkLCAnLi4nKTtcblxuXHRcdFx0aWYgKGN3ZCA9PT0gb3B0cy5jd2QpXG5cdFx0XHR7XG5cdFx0XHRcdC8vYm9vbCA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm4gcmVqZWN0RmFpbChgdGhlcmUgaXMgbm8gYW55IHBhcmVudCBwYXRoOiAke2N3ZH1gKTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0ZWxzZVxuXHR7XG5cdFx0cmV0dXJuIHJlamVjdEZhaWwoYHBhdGggbm90IGV4aXN0cyAke2N3ZH1gKTtcblx0fVxuXG5cdHJldHVybiByZWplY3RGYWlsKGB1bmtub3cgZXJyb3JgKTtcblxuXHRmdW5jdGlvbiByZWplY3RGYWlsPEUgZXh0ZW5kcyBzdHJpbmcgfCBFcnJvcj4obWVzc2FnZTogRSlcblx0e1xuXHRcdGJvb2wgPSBmYWxzZTtcblxuXHRcdGlmIChtZXNzYWdlIGluc3RhbmNlb2YgRXJyb3IpXG5cdFx0e1xuXHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0bWVzc2FnZS5fZGF0YSA9IHtcblx0XHRcdFx0Y3dkLFxuXHRcdFx0XHRwYXR0ZXJuLFxuXHRcdFx0XHRvcHRpb25zOiBvcHRzLFxuXHRcdFx0XHRoaXN0b3J5LFxuXHRcdFx0fTtcblxuXHRcdFx0dGhyb3cgbWVzc2FnZTtcblx0XHR9XG5cblx0XHRpZiAob3B0cy5kaXNhYmxlVGhyb3dXaGVuRW1wdHkpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHJlc29sdmUoe1xuXHRcdFx0XHR2YWx1ZTogW10sXG5cdFx0XHRcdGN3ZCxcblx0XHRcdFx0cGF0dGVybjogcGF0dGVybiBhcyBzdHJpbmdbXSxcblx0XHRcdFx0b3B0aW9uczogb3B0cyxcblx0XHRcdFx0aGlzdG9yeSxcblx0XHRcdFx0ZXJyRGF0YToge1xuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRtZXNzYWdlLFxuXHRcdFx0XHRcdF9kYXRhOiB7XG5cdFx0XHRcdFx0XHRjd2QsXG5cdFx0XHRcdFx0XHRwYXR0ZXJuOiBwYXR0ZXJuIGFzIHN0cmluZ1tdLFxuXHRcdFx0XHRcdFx0b3B0aW9uczogb3B0cyxcblx0XHRcdFx0XHRcdGhpc3RvcnksXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0fSlcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRocm93IF9lcnJvcih7XG5cdFx0XHRcdG1lc3NhZ2UsXG5cdFx0XHRcdF9kYXRhOiB7XG5cdFx0XHRcdFx0Y3dkLFxuXHRcdFx0XHRcdHBhdHRlcm46IHBhdHRlcm4gYXMgc3RyaW5nW10sXG5cdFx0XHRcdFx0b3B0aW9uczogb3B0cyxcblx0XHRcdFx0XHRoaXN0b3J5LFxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZXNvbHZlPFIgZXh0ZW5kcyBJUmV0dXJuVmFsdWU8VD4+KGRhdGE6IFIpOiBJUmV0dXJuVmFsdWVTeW5jPFQ+XG5cdHtcblx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihkYXRhLCB7XG5cblx0XHRcdHRoZW46IGZ1bmN0aW9uIGZha2VUaGVuKGZuKVxuXHRcdFx0e1xuXHRcdFx0XHRkZWxldGUgKGRhdGEgYXMgYW55IGFzIElSZXR1cm5WYWx1ZVN5bmM8VD4pLnRoZW47XG5cblx0XHRcdFx0bGV0IHJldCA9IGZuKGRhdGEpO1xuXG5cdFx0XHRcdGhhbmRsZVByb21pc2UocmV0LCBkYXRhKTtcblxuXHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0fSxcblxuXHRcdFx0Y2F0Y2g6IGZ1bmN0aW9uIGZha2VDYXRjaChmbilcblx0XHRcdHtcblx0XHRcdFx0ZGVsZXRlIChkYXRhIGFzIGFueSBhcyBJUmV0dXJuVmFsdWVTeW5jPFQ+KS5jYXRjaDtcblxuXHRcdFx0XHRsZXQgZSA9IG51bGw7XG5cblx0XHRcdFx0aWYgKGRhdGEuZXJyRGF0YSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGUgPSBfZXJyb3IoZGF0YS5lcnJEYXRhKTtcblxuXHRcdFx0XHRcdGxldCByZXQgPSBmbihlKTtcblxuXHRcdFx0XHRcdGhhbmRsZVByb21pc2UocmV0LCBkYXRhKTtcblxuXHRcdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIGRhdGFcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0dGFwOiBmdW5jdGlvbiBmYWtlVGFwKGZuKVxuXHRcdFx0e1xuXHRcdFx0XHRkZWxldGUgKGRhdGEgYXMgYW55IGFzIElSZXR1cm5WYWx1ZVN5bmM8VD4pLnRhcDtcblxuXHRcdFx0XHRsZXQgcmV0ID0gZm4oZGF0YSk7XG5cblx0XHRcdFx0aWYgKGhhbmRsZVByb21pc2UocmV0LCBkYXRhKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiByZXQudGhlbihmdW5jdGlvbiAoKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdH0sXG5cdFx0XHR0YXBDYXRjaDogZnVuY3Rpb24gZmFrZVRhcENhdGNoKGZuKVxuXHRcdFx0e1xuXHRcdFx0XHRsZXQgZSA9IG51bGw7XG5cblx0XHRcdFx0ZGVsZXRlIChkYXRhIGFzIGFueSBhcyBJUmV0dXJuVmFsdWVTeW5jPFQ+KS50YXBDYXRjaDtcblxuXHRcdFx0XHRpZiAoZGF0YS5lcnJEYXRhKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZSA9IF9lcnJvcihkYXRhLmVyckRhdGEpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bGV0IHJldCA9IGZuKGUpO1xuXG5cdFx0XHRcdGlmIChoYW5kbGVQcm9taXNlKHJldCwgZGF0YSkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gcmV0LnRoZW4oZnVuY3Rpb24gKClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9LFxuXHRcdH0pXG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVQcm9taXNlKHJldCwgZGF0YTogSVJldHVyblZhbHVlU3luYzxUPiB8IElSZXR1cm5WYWx1ZTxUPilcblx0e1xuXHRcdGlmIChyZXQgIT09IGRhdGEgJiYgaXNQcm9taXNlKHJldCkpXG5cdFx0e1xuXHRcdFx0ZGVsZXRlIChkYXRhIGFzIGFueSBhcyBJUmV0dXJuVmFsdWVTeW5jPFQ+KS50YXA7XG5cdFx0XHRkZWxldGUgKGRhdGEgYXMgYW55IGFzIElSZXR1cm5WYWx1ZVN5bmM8VD4pLnRhcENhdGNoO1xuXHRcdFx0ZGVsZXRlIChkYXRhIGFzIGFueSBhcyBJUmV0dXJuVmFsdWVTeW5jPFQ+KS50aGVuO1xuXHRcdFx0ZGVsZXRlIChkYXRhIGFzIGFueSBhcyBJUmV0dXJuVmFsdWVTeW5jPFQ+KS5jYXRjaDtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbmV4cG9ydCB7XG5cdGdsb2JTZWFyY2ggYXMgYXN5bmMsXG5cdGdsb2JTZWFyY2hTeW5jIGFzIHN5bmMsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnM8VCBleHRlbmRzIEVudHJ5SXRlbT4gZXh0ZW5kcyBGYXN0R2xvYi5PcHRpb25zPFQ+XG57XG5cdGN3ZD86IHN0cmluZyxcblx0ZGVlcD86IG51bWJlciB8IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIEBkZWZhdWx0IGN1cnJlbnQgcGFja2FnZSBwYXRoXG5cdCAqL1xuXHRzdG9wUGF0aD86IHN0cmluZyB8IHN0cmluZ1tdIHwgYm9vbGVhbjtcblxuXHQvKipcblx0ICogQGRlZmF1bHQgdHJ1ZVxuXHQgKi9cblx0Zm9sbG93U3ltbGlua2VkRGlyZWN0b3JpZXM/OiBib29sZWFuLFxuXG5cdHNvcnRDb21wYXJlRm4/OiBib29sZWFuIHwgKChhOiBULCBiOiBUKSA9PiBudW1iZXIpLFxuXG5cdGlnbm9yZT86IHN0cmluZ1tdLFxuXG5cdGRpc2FibGVUaHJvd1doZW5FbXB0eT86IGJvb2xlYW4sXG5cblx0cGF0aExpYj86IElQYXRoTGliQmFzZSxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmV0dXJuVmFsdWU8VCBleHRlbmRzIEVudHJ5SXRlbT5cbntcblx0dmFsdWU6IFRbXSxcblx0Y3dkOiBzdHJpbmcsXG5cblx0cGF0dGVybjogc3RyaW5nW10sXG5cdG9wdGlvbnM6IElPcHRpb25zUnVudGltZTxUPixcblx0aGlzdG9yeTogc3RyaW5nW10sXG5cblx0ZXJyRGF0YT86IFBhcnRpYWw8SVJldHVybkVycm9yPFQ+Pixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmV0dXJuVmFsdWVTeW5jPFQgZXh0ZW5kcyBFbnRyeUl0ZW0+IGV4dGVuZHMgSVJldHVyblZhbHVlPFQ+XG57XG5cdHRoZW48Uj4oZm46IChkYXRhOiBJUmV0dXJuVmFsdWVTeW5jPFQ+KSA9PiBSKTogUixcblx0Y2F0Y2g8Uj4oZm46IChlcnI6IElSZXR1cm5FcnJvcjxUPikgPT4gUik6IElSZXR1cm5WYWx1ZVN5bmM8VD4gJiBSLFxuXG5cdHRhcChmbjogKGRhdGE6IElSZXR1cm5WYWx1ZVN5bmM8VD4pID0+IGFueSk6IElSZXR1cm5WYWx1ZVN5bmM8VD4sXG5cdHRhcENhdGNoKGZuOiAoZXJyOiBJUmV0dXJuRXJyb3I8VD4pID0+IGFueSk6IElSZXR1cm5WYWx1ZVN5bmM8VD4sXG59XG5cbmV4cG9ydCB0eXBlIElPcHRpb25zUnVudGltZTxUIGV4dGVuZHMgRW50cnlJdGVtPiA9IElUU092ZXJ3cml0ZTxJT3B0aW9uczxUPiwge1xuXHRzb3J0Q29tcGFyZUZuPyhhOiBULCBiOiBUKTogbnVtYmVyLFxuXHRpZ25vcmU/OiBzdHJpbmdbXSxcblx0c3RvcFBhdGg/OiBzdHJpbmdbXTtcblxuXHQvL3BhdGhMaWI/OiBJUGF0aExpYkJhc2UgJiB0eXBlb2YgX3BhdGggJiB0eXBlb2YgX3VwYXRoLFxufT5cblxuZXhwb3J0IGludGVyZmFjZSBJUGF0aExpYkJhc2Vcbntcblx0c2VwOiBzdHJpbmcsXG5cdG5vcm1hbGl6ZShwYXRoOiBzdHJpbmcpOiBzdHJpbmc7XG5cdHJlc29sdmUoLi4ucGF0aHM6IHN0cmluZ1tdKTogc3RyaW5nO1xuXHRqb2luKC4uLnBhdGhzOiBzdHJpbmdbXSk6IHN0cmluZztcbn1cblxuXG5leHBvcnQgdHlwZSBJUmV0dXJuRXJyb3I8VCBleHRlbmRzIEVudHJ5SXRlbSwgRSBleHRlbmRzIEVycm9yID0gRXJyb3I+ID0gRSAmIHtcblx0bWVzc2FnZTogc3RyaW5nLFxuXHRfZGF0YToge1xuXHRcdGN3ZDogc3RyaW5nLFxuXG5cdFx0cGF0dGVybjogc3RyaW5nW10sXG5cdFx0b3B0aW9uczogSU9wdGlvbnNSdW50aW1lPFQ+LFxuXG5cdFx0aGlzdG9yeTogc3RyaW5nW10sXG5cdH0sXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb21pc2U8VCBleHRlbmRzIFByb21pc2U8YW55Pj4ocmV0OiBUKTogcmV0IGlzIFRcbmV4cG9ydCBmdW5jdGlvbiBpc1Byb21pc2U8VCBleHRlbmRzIEJsdWViaXJkPGFueT4+KHJldDogVCk6IHJldCBpcyBUXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9taXNlKHJldClcbntcblx0aWYgKEJsdWViaXJkLmlzKHJldCkpXG5cdHtcblx0XHRyZXR1cm4gdHJ1ZVxuXHR9XG5cdGVsc2UgaWYgKHJldCBpbnN0YW5jZW9mIFByb21pc2UpXG5cdHtcblx0XHRyZXR1cm4gdHJ1ZVxuXHR9XG5cblx0cmV0dXJuIGZhbHNlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVBcmdzPFQgZXh0ZW5kcyBFbnRyeUl0ZW0gPSBzdHJpbmc+KHBhdHRlcm46IHN0cmluZyB8IHN0cmluZ1tdLCBvcHRpb25zPzogSU9wdGlvbnM8VD4pOiB7XG5cdHBhdHRlcm46IHN0cmluZ1tdLFxuXHRvcHRpb25zOiBJT3B0aW9uc1J1bnRpbWU8VD4sXG59XG57XG5cdGlmICh0eXBlb2YgcGF0dGVybiA9PT0gJ3N0cmluZycpXG5cdHtcblx0XHRwYXR0ZXJuID0gW3BhdHRlcm5dO1xuXHR9XG5cblx0ZXhwZWN0KHBhdHRlcm4pLmlzLmFuKCdhcnJheScpO1xuXG5cdHBhdHRlcm4gPSBwYXR0ZXJuLmZpbHRlcih2ID0+IHR5cGVvZiB2ID09PSAnc3RyaW5nJyAmJiB2ICE9PSAnJyk7XG5cblx0ZXhwZWN0KHBhdHRlcm4pLmhhdmUubGVuZ3RoT2YuZ3QoMCk7XG5cblx0bGV0IG9wdHMgPSBPYmplY3QuYXNzaWduKHtcblx0XHRmb2xsb3dTeW1saW5rZWREaXJlY3RvcmllczogdHJ1ZSxcblx0XHRtYXJrRGlyZWN0b3JpZXM6IHRydWUsXG5cdFx0dW5pcXVlOiB0cnVlLFxuXHRcdGN3ZDogcHJvY2Vzcy5jd2QoKSxcblx0XHQvL3N0b3BQYXRoOiBbXSxcblx0XHRpZ25vcmU6IFtdLFxuXHR9LCBvcHRpb25zIHx8IHt9KTtcblxuXG5cdGV4cGVjdChvcHRzLmN3ZCkuaXMuYW4oJ3N0cmluZycpO1xuXG5cdG9wdHMucGF0aExpYiA9IG9wdHMucGF0aExpYiB8fCBfcGF0aDtcblx0Y29uc3QgcGF0aCA9IG9wdHMucGF0aExpYiBhcyBJT3B0aW9uc1J1bnRpbWU8VD5bXCJwYXRoTGliXCJdO1xuXG5cdGV4cGVjdChwYXRoLmpvaW4pLmlzLmFuKCdmdW5jdGlvbicpO1xuXHRleHBlY3QocGF0aC5zZXApLmlzLmFuKCdzdHJpbmcnKTtcblx0ZXhwZWN0KHBhdGgubm9ybWFsaXplKS5pcy5hbignZnVuY3Rpb24nKTtcblx0ZXhwZWN0KHBhdGgucmVzb2x2ZSkuaXMuYW4oJ2Z1bmN0aW9uJyk7XG5cblx0bGV0IGN3ZCA9IHBhdGgubm9ybWFsaXplKG9wdHMuY3dkKTtcblxuXHRpZiAoY3dkID09PSAnLicgfHwgY3dkID09PSAnLi4nKVxuXHR7XG5cdFx0Y3dkID0gcGF0aC5yZXNvbHZlKGN3ZCk7XG5cdH1cblxuXHRvcHRzLmN3ZCA9IGN3ZDtcblxuXHRpZiAob3B0cy5zdG9wUGF0aCA9PSBudWxsIHx8IG9wdHMuc3RvcFBhdGggPT09IHRydWUpXG5cdHtcblx0XHRsZXQgcm9vdCA9IHBrZ0Rpci5zeW5jKGN3ZCk7XG5cblx0XHRvcHRzLnN0b3BQYXRoID0gW107XG5cdFx0aWYgKHJvb3QpXG5cdFx0e1xuXHRcdFx0b3B0cy5zdG9wUGF0aC5wdXNoKHJvb3QpO1xuXHRcdH1cblx0fVxuXHRlbHNlIGlmICh0eXBlb2Ygb3B0cy5zdG9wUGF0aCA9PT0gJ3N0cmluZycpXG5cdHtcblx0XHRvcHRzLnN0b3BQYXRoID0gW29wdHMuc3RvcFBhdGhdO1xuXHR9XG5cdGVsc2UgaWYgKG9wdHMuc3RvcFBhdGggPT09IGZhbHNlKVxuXHR7XG5cdFx0b3B0cy5zdG9wUGF0aCA9IFtdO1xuXHR9XG5cblx0ZXhwZWN0KG9wdHMuc3RvcFBhdGgpLmlzLmFuKCdhcnJheScpO1xuXG5cdG9wdHMuc3RvcFBhdGggPSBvcHRzLnN0b3BQYXRoLm1hcCh2ID0+XG5cdHtcblxuXHRcdGlmICh0eXBlb2YgdiAhPT0gJ3N0cmluZycpXG5cdFx0e1xuXHRcdFx0ZXhwZWN0KHYsIGBvcHRpb25zLnN0b3BQYXRoIG11c3QgaXMgc3RyaW5nIG9yIHN0cmluZ1tdYCkuaXMuYW4oJ3N0cmluZycpO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYXRoLm5vcm1hbGl6ZSh2KVxuXHR9KTtcblxuXHRpZiAob3B0cy5pZ25vcmUgPT0gbnVsbClcblx0e1xuXHRcdG9wdHMuaWdub3JlID0gW107XG5cdH1cblx0ZWxzZSBpZiAodHlwZW9mIG9wdHMuaWdub3JlID09PSAnc3RyaW5nJylcblx0e1xuXHRcdG9wdHMuaWdub3JlID0gW29wdHMuaWdub3JlXTtcblx0fVxuXG5cdGV4cGVjdChvcHRzLmlnbm9yZSkuaXMuYW4oJ2FycmF5Jyk7XG5cblx0b3B0cy5pZ25vcmUuZm9yRWFjaCh2ID0+XG5cdHtcblx0XHRpZiAodHlwZW9mIHYgIT09ICdzdHJpbmcnKVxuXHRcdHtcblx0XHRcdGV4cGVjdCh2LCBgb3B0aW9ucy5pZ25vcmUgbXVzdCBpcyBzdHJpbmdbXWApLmlzLmFuKCdzdHJpbmcnKTtcblx0XHR9XG5cdH0pO1xuXG5cdGlmIChvcHRzLnNvcnRDb21wYXJlRm4gPT09IHRydWUgfHwgb3B0cy5zb3J0Q29tcGFyZUZuID09IG51bGwpXG5cdHtcblx0XHRvcHRzLnNvcnRDb21wYXJlRm4gPSBuYXR1cmFsQ29tcGFyZTtcblx0fVxuXHRlbHNlIGlmIChvcHRzLnNvcnRDb21wYXJlRm4pXG5cdHtcblx0XHRleHBlY3Qob3B0cy5zb3J0Q29tcGFyZUZuKS5pcy5hbignZnVuY3Rpb24nKTtcblx0fVxuXHRlbHNlXG5cdHtcblx0XHRvcHRzLnNvcnRDb21wYXJlRm4gPSBudWxsXG5cdH1cblxuXHRvcHRzLmRpc2FibGVUaHJvd1doZW5FbXB0eSA9ICEhb3B0cy5kaXNhYmxlVGhyb3dXaGVuRW1wdHk7XG5cblx0cmV0dXJuIHtcblx0XHRwYXR0ZXJuLFxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRvcHRpb25zOiBvcHRzLFxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfZXJyb3I8RSBleHRlbmRzIEVycm9yLCBEIGV4dGVuZHMgYW55PihkYXRhOiB7XG5cdG1lc3NhZ2U/OiBzdHJpbmcgfCBhbnksXG5cdF9kYXRhPzogRCxcblx0Ly8gQHRzLWlnbm9yZVxufSwgRXJyOiAobmV3ICguLi5hcmdzKSA9PiBFKSA9IEVycm9yKTogRSAmIHtcblx0X2RhdGE/OiBEXG59XG57XG5cdGxldCBlID0gbmV3IEVycihkYXRhLm1lc3NhZ2UgfHwgZGF0YS5fZGF0YSk7XG5cdC8vIEB0cy1pZ25vcmVcblx0ZS5fZGF0YSA9IGRhdGEuX2RhdGE7XG5cdC8vIEB0cy1pZ25vcmVcblx0cmV0dXJuIGU7XG59XG5cbmltcG9ydCBHbG9iU2VhcmNoID0gcmVxdWlyZSgnLi9pbmRleCcpO1xuZXhwb3J0IGRlZmF1bHQgR2xvYlNlYXJjaFxuIl19