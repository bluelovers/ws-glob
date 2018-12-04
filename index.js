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
        opts.stopPath = [pkgDir.sync(cwd)];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7R0FFRzs7QUFFSCwrQkFBZ0M7QUFDaEMsc0NBQXVDO0FBQ3ZDLHFDQUFzQztBQUN0Qyw4QkFBK0I7QUFHL0IsK0JBQThCO0FBQzlCLHlEQUEwRDtBQUMxRCxrQ0FBbUM7QUFHbkMsU0FBZ0IsVUFBVSxDQUErQixPQUEwQixFQUFFLE9BQXFCO0lBRXpHLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRXRELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUF3QyxDQUFDO0lBRTlELE9BQU8sSUFBSSxRQUFRLENBQWtCLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFFOUQsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUF1QixDQUFDO1FBRTVELElBQUksT0FBTyxHQUFhLEVBQUUsQ0FBQztRQUMzQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFFaEIsSUFBSSxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQzVCO1lBQ0MsT0FBTyxJQUFJLEVBQ1g7Z0JBQ0MsSUFBSSxHQUFHLEtBQUssR0FBRyxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQy9CO29CQUNDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN4QjtnQkFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUVsQixtQkFBbUI7Z0JBRW5CLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO2dCQUVmLElBQUks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Q0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDN0M7U0FFRDtRQUNDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFBO0tBQ3pCO0lBRUQsSUFBSSxDQUFDLHFCQUFxQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUM7SUFFMUQsT0FBTztRQUNOLE9BQU87UUFDUCxhQUFhO1FBQ2IsT0FBTyxFQUFFLElBQUk7S0FDYixDQUFBO0FBQ0YsQ0FBQztBQTlHRCxnQ0E4R0M7QUFFRCxTQUFnQixNQUFNLENBQWlDLElBSXRELEVBQUUsTUFBNEIsS0FBSztJQUluQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QyxhQUFhO0lBQ2IsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3JCLGFBQWE7SUFDYixPQUFPLENBQUMsQ0FBQztBQUNWLENBQUM7QUFiRCx3QkFhQztBQUVELHNDQUF1QztBQUN2QyxrQkFBZSxVQUFVLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDE4LzEyLzQvMDA0LlxuICovXG5cbmltcG9ydCBmcyA9IHJlcXVpcmUoJ2ZzLWV4dHJhJyk7XG5pbXBvcnQgRmFzdEdsb2IgPSByZXF1aXJlKCdmYXN0LWdsb2InKTtcbmltcG9ydCBCbHVlYmlyZCA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5pbXBvcnQgX3BhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5pbXBvcnQgX3VwYXRoID0gcmVxdWlyZSgndXBhdGgyJyk7XG5pbXBvcnQgeyBFbnRyeUl0ZW0gfSBmcm9tICdmYXN0LWdsb2Ivb3V0L3R5cGVzL2VudHJpZXMnO1xuaW1wb3J0IHsgZXhwZWN0IH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgbmF0dXJhbENvbXBhcmUgPSByZXF1aXJlKCdzdHJpbmctbmF0dXJhbC1jb21wYXJlJyk7XG5pbXBvcnQgcGtnRGlyID0gcmVxdWlyZSgncGtnLWRpcicpO1xuaW1wb3J0IHsgSVRTT3ZlcndyaXRlLCBJVFNSZXNvbHZhYmxlIH0gZnJvbSAndHMtdHlwZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnbG9iU2VhcmNoPFQgZXh0ZW5kcyBFbnRyeUl0ZW0gPSBzdHJpbmc+KHBhdHRlcm46IHN0cmluZyB8IHN0cmluZ1tdLCBvcHRpb25zPzogSU9wdGlvbnM8VD4pXG57XG5cdCh7IHBhdHRlcm4sIG9wdGlvbnMgfSA9IGhhbmRsZUFyZ3MocGF0dGVybiwgb3B0aW9ucykpO1xuXG5cdGNvbnN0IHBhdGggPSBvcHRpb25zLnBhdGhMaWIgYXMgSU9wdGlvbnNSdW50aW1lPFQ+W1wicGF0aExpYlwiXTtcblxuXHRyZXR1cm4gbmV3IEJsdWViaXJkPElSZXR1cm5WYWx1ZTxUPj4oYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT5cblx0e1xuXHRcdGxldCBjd2QgPSBfcGF0aC5ub3JtYWxpemUob3B0aW9ucy5jd2QpO1xuXHRcdGxldCBvcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucykgYXMgSU9wdGlvbnNSdW50aW1lPFQ+O1xuXG5cdFx0bGV0IGhpc3Rvcnk6IHN0cmluZ1tdID0gW107XG5cdFx0bGV0IGJvb2wgPSB0cnVlO1xuXG5cdFx0aWYgKGF3YWl0IGZzLnBhdGhFeGlzdHMoY3dkKSlcblx0XHR7XG5cdFx0XHR3aGlsZSAoYm9vbClcblx0XHRcdHtcblx0XHRcdFx0aWYgKGN3ZCA9PT0gJy4nIHx8IGN3ZCA9PT0gJy4uJylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGN3ZCA9IHBhdGgucmVzb2x2ZShjd2QpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aGlzdG9yeS5wdXNoKGN3ZCk7XG5cblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhjd2QpO1xuXG5cdFx0XHRcdG9wdHMuY3dkID0gY3dkO1xuXG5cdFx0XHRcdGxldCB2YWx1ZSA9IGF3YWl0IEZhc3RHbG9iXG5cdFx0XHRcdFx0LmFzeW5jPFQ+KHBhdHRlcm4sIG9wdHMpXG5cdFx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChlKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGJvb2wgPSBmYWxzZTtcblxuXHRcdFx0XHRcdFx0ZS5fZGF0YSA9IHtcblx0XHRcdFx0XHRcdFx0Y3dkLFxuXHRcdFx0XHRcdFx0XHRwYXR0ZXJuOiBwYXR0ZXJuIGFzIHN0cmluZ1tdLFxuXHRcdFx0XHRcdFx0XHRvcHRpb25zOiBvcHRzLFxuXHRcdFx0XHRcdFx0XHRoaXN0b3J5LFxuXHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xuXHRcdFx0XHRcdH0pIGFzIFRbXVxuXHRcdFx0XHQ7XG5cblx0XHRcdFx0aWYgKCFib29sKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHZhbHVlLmxlbmd0aClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmIChvcHRzLnNvcnRDb21wYXJlRm4pXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dmFsdWUuc29ydChvcHRzLnNvcnRDb21wYXJlRm4pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJlc29sdmUoe1xuXHRcdFx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdFx0XHRjd2QsXG5cdFx0XHRcdFx0XHRwYXR0ZXJuOiBwYXR0ZXJuIGFzIHN0cmluZ1tdLFxuXHRcdFx0XHRcdFx0b3B0aW9uczogb3B0cyxcblx0XHRcdFx0XHRcdGhpc3RvcnksXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vY29uc29sZS5sb2coY3dkKTtcblxuXHRcdFx0XHRpZiAob3B0cy5zdG9wUGF0aC5pbmNsdWRlcyhjd2QpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly9ib29sID0gZmFsc2U7XG5cdFx0XHRcdFx0cmVqZWN0RmFpbChgc3RvcCBzZWFyY2ggYXQgJHtjd2R9YCk7XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8qXG5cdFx0XHRcdGxldCB0ID0gcGF0aC5yZXNvbHZlKGN3ZCk7XG5cblx0XHRcdFx0b3B0cy5pZ25vcmUucHVzaChjd2QgKyBwYXRoLnNlcCk7XG5cdFx0XHRcdG9wdHMuaWdub3JlLnB1c2goY3dkICsgcGF0aC5zZXAgKyAnKionKTtcblxuXHRcdFx0XHRpZiAodCAhPSBjd2QpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRvcHRzLmlnbm9yZS5wdXNoKHQgKyBwYXRoLnNlcCk7XG5cdFx0XHRcdFx0b3B0cy5pZ25vcmUucHVzaCh0ICsgcGF0aC5zZXAgKyAnKionKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQqL1xuXG5cdFx0XHRcdGN3ZCA9IHBhdGgucmVzb2x2ZShjd2QsICcuLicpO1xuXG5cdFx0XHRcdGlmIChjd2QgPT09IG9wdHMuY3dkKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ly9ib29sID0gZmFsc2U7XG5cdFx0XHRcdFx0cmVqZWN0RmFpbChgdGhlcmUgaXMgbm8gYW55IHBhcmVudCBwYXRoOiAke2N3ZH1gKTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChib29sKVxuXHRcdFx0e1xuXHRcdFx0XHRyZWplY3RGYWlsKGB1bmtub3cgZXJyb3JgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHJlamVjdEZhaWwoYHBhdGggbm90IGV4aXN0cyAke2N3ZH1gKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiByZWplY3RGYWlsKG1lc3NhZ2U6IHN0cmluZylcblx0XHR7XG5cdFx0XHRib29sID0gZmFsc2U7XG5cblx0XHRcdGlmIChvcHRzLmRpc2FibGVUaHJvd1doZW5FbXB0eSlcblx0XHRcdHtcblx0XHRcdFx0cmVzb2x2ZSh7XG5cdFx0XHRcdFx0dmFsdWU6IFtdLFxuXHRcdFx0XHRcdGN3ZCxcblx0XHRcdFx0XHRwYXR0ZXJuOiBwYXR0ZXJuIGFzIHN0cmluZ1tdLFxuXHRcdFx0XHRcdG9wdGlvbnM6IG9wdHMsXG5cdFx0XHRcdFx0aGlzdG9yeSxcblx0XHRcdFx0XHRlcnJEYXRhOiB7XG5cdFx0XHRcdFx0XHRtZXNzYWdlLFxuXHRcdFx0XHRcdFx0X2RhdGE6IHtcblx0XHRcdFx0XHRcdFx0Y3dkLFxuXHRcdFx0XHRcdFx0XHRwYXR0ZXJuOiBwYXR0ZXJuIGFzIHN0cmluZ1tdLFxuXHRcdFx0XHRcdFx0XHRvcHRpb25zOiBvcHRzLFxuXHRcdFx0XHRcdFx0XHRoaXN0b3J5LFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdHJlamVjdChfZXJyb3Ioe1xuXHRcdFx0XHRcdG1lc3NhZ2UsXG5cdFx0XHRcdFx0X2RhdGE6IHtcblx0XHRcdFx0XHRcdGN3ZCxcblx0XHRcdFx0XHRcdHBhdHRlcm46IHBhdHRlcm4gYXMgc3RyaW5nW10sXG5cdFx0XHRcdFx0XHRvcHRpb25zOiBvcHRzLFxuXHRcdFx0XHRcdFx0aGlzdG9yeSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnbG9iU2VhcmNoU3luYzxUIGV4dGVuZHMgRW50cnlJdGVtID0gc3RyaW5nPihwYXR0ZXJuOiBzdHJpbmcgfCBzdHJpbmdbXSwgb3B0aW9ucz86IElPcHRpb25zPFQ+KTogSVJldHVyblZhbHVlU3luYzxUPlxue1xuXHQoeyBwYXR0ZXJuLCBvcHRpb25zIH0gPSBoYW5kbGVBcmdzKHBhdHRlcm4sIG9wdGlvbnMpKTtcblxuXHRjb25zdCBwYXRoID0gb3B0aW9ucy5wYXRoTGliIGFzIElPcHRpb25zUnVudGltZTxUPltcInBhdGhMaWJcIl07XG5cblx0bGV0IGN3ZCA9IF9wYXRoLm5vcm1hbGl6ZShvcHRpb25zLmN3ZCk7XG5cdGxldCBvcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucykgYXMgSU9wdGlvbnNSdW50aW1lPFQ+O1xuXG5cdGxldCBoaXN0b3J5OiBzdHJpbmdbXSA9IFtdO1xuXHRsZXQgYm9vbCA9IHRydWU7XG5cblx0aWYgKGZzLnBhdGhFeGlzdHNTeW5jKGN3ZCkpXG5cdHtcblx0XHR3aGlsZSAoYm9vbClcblx0XHR7XG5cdFx0XHRpZiAoY3dkID09PSAnLicgfHwgY3dkID09PSAnLi4nKVxuXHRcdFx0e1xuXHRcdFx0XHRjd2QgPSBwYXRoLnJlc29sdmUoY3dkKTtcblx0XHRcdH1cblxuXHRcdFx0aGlzdG9yeS5wdXNoKGN3ZCk7XG5cblx0XHRcdC8vY29uc29sZS5sb2coY3dkKTtcblxuXHRcdFx0b3B0cy5jd2QgPSBjd2Q7XG5cblx0XHRcdGxldCB2YWx1ZTogVFtdO1xuXG5cdFx0XHR0cnlcblx0XHRcdHtcblx0XHRcdFx0dmFsdWUgPSBGYXN0R2xvYi5zeW5jPFQ+KHBhdHRlcm4sIG9wdHMpO1xuXHRcdFx0fVxuXHRcdFx0Y2F0Y2ggKGUpXG5cdFx0XHR7XG5cdFx0XHRcdHJldHVybiByZWplY3RGYWlsKGUpXG5cdFx0XHR9XG5cblx0XHRcdGlmICghYm9vbClcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodmFsdWUubGVuZ3RoKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAob3B0cy5zb3J0Q29tcGFyZUZuKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dmFsdWUuc29ydChvcHRzLnNvcnRDb21wYXJlRm4pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHJlc29sdmUoe1xuXHRcdFx0XHRcdHZhbHVlLFxuXHRcdFx0XHRcdGN3ZCxcblx0XHRcdFx0XHRwYXR0ZXJuLFxuXHRcdFx0XHRcdG9wdGlvbnM6IG9wdHMsXG5cdFx0XHRcdFx0aGlzdG9yeSxcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdC8vY29uc29sZS5sb2coY3dkKTtcblxuXHRcdFx0aWYgKG9wdHMuc3RvcFBhdGguaW5jbHVkZXMoY3dkKSlcblx0XHRcdHtcblx0XHRcdFx0Ly9ib29sID0gZmFsc2U7XG5cdFx0XHRcdHJldHVybiByZWplY3RGYWlsKGBzdG9wIHNlYXJjaCBhdCAke2N3ZH1gKTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Lypcblx0XHRcdGxldCB0ID0gcGF0aC5yZXNvbHZlKGN3ZCk7XG5cblx0XHRcdG9wdHMuaWdub3JlLnB1c2goY3dkICsgcGF0aC5zZXApO1xuXHRcdFx0b3B0cy5pZ25vcmUucHVzaChjd2QgKyBwYXRoLnNlcCArICcqKicpO1xuXG5cdFx0XHRpZiAodCAhPSBjd2QpXG5cdFx0XHR7XG5cdFx0XHRcdG9wdHMuaWdub3JlLnB1c2godCArIHBhdGguc2VwKTtcblx0XHRcdFx0b3B0cy5pZ25vcmUucHVzaCh0ICsgcGF0aC5zZXAgKyAnKionKTtcblx0XHRcdH1cblx0XHRcdCovXG5cblx0XHRcdGN3ZCA9IHBhdGgucmVzb2x2ZShjd2QsICcuLicpO1xuXG5cdFx0XHRpZiAoY3dkID09PSBvcHRzLmN3ZClcblx0XHRcdHtcblx0XHRcdFx0Ly9ib29sID0gZmFsc2U7XG5cdFx0XHRcdHJldHVybiByZWplY3RGYWlsKGB0aGVyZSBpcyBubyBhbnkgcGFyZW50IHBhdGg6ICR7Y3dkfWApO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRlbHNlXG5cdHtcblx0XHRyZXR1cm4gcmVqZWN0RmFpbChgcGF0aCBub3QgZXhpc3RzICR7Y3dkfWApO1xuXHR9XG5cblx0cmV0dXJuIHJlamVjdEZhaWwoYHVua25vdyBlcnJvcmApO1xuXG5cdGZ1bmN0aW9uIHJlamVjdEZhaWw8RSBleHRlbmRzIHN0cmluZyB8IEVycm9yPihtZXNzYWdlOiBFKVxuXHR7XG5cdFx0Ym9vbCA9IGZhbHNlO1xuXG5cdFx0aWYgKG1lc3NhZ2UgaW5zdGFuY2VvZiBFcnJvcilcblx0XHR7XG5cdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRtZXNzYWdlLl9kYXRhID0ge1xuXHRcdFx0XHRjd2QsXG5cdFx0XHRcdHBhdHRlcm4sXG5cdFx0XHRcdG9wdGlvbnM6IG9wdHMsXG5cdFx0XHRcdGhpc3RvcnksXG5cdFx0XHR9O1xuXG5cdFx0XHR0aHJvdyBtZXNzYWdlO1xuXHRcdH1cblxuXHRcdGlmIChvcHRzLmRpc2FibGVUaHJvd1doZW5FbXB0eSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gcmVzb2x2ZSh7XG5cdFx0XHRcdHZhbHVlOiBbXSxcblx0XHRcdFx0Y3dkLFxuXHRcdFx0XHRwYXR0ZXJuOiBwYXR0ZXJuIGFzIHN0cmluZ1tdLFxuXHRcdFx0XHRvcHRpb25zOiBvcHRzLFxuXHRcdFx0XHRoaXN0b3J5LFxuXHRcdFx0XHRlcnJEYXRhOiB7XG5cdFx0XHRcdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdFx0XHRcdG1lc3NhZ2UsXG5cdFx0XHRcdFx0X2RhdGE6IHtcblx0XHRcdFx0XHRcdGN3ZCxcblx0XHRcdFx0XHRcdHBhdHRlcm46IHBhdHRlcm4gYXMgc3RyaW5nW10sXG5cdFx0XHRcdFx0XHRvcHRpb25zOiBvcHRzLFxuXHRcdFx0XHRcdFx0aGlzdG9yeSxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHR9KVxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0dGhyb3cgX2Vycm9yKHtcblx0XHRcdFx0bWVzc2FnZSxcblx0XHRcdFx0X2RhdGE6IHtcblx0XHRcdFx0XHRjd2QsXG5cdFx0XHRcdFx0cGF0dGVybjogcGF0dGVybiBhcyBzdHJpbmdbXSxcblx0XHRcdFx0XHRvcHRpb25zOiBvcHRzLFxuXHRcdFx0XHRcdGhpc3RvcnksXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHJlc29sdmU8UiBleHRlbmRzIElSZXR1cm5WYWx1ZTxUPj4oZGF0YTogUik6IElSZXR1cm5WYWx1ZVN5bmM8VD5cblx0e1xuXHRcdHJldHVybiBPYmplY3QuYXNzaWduKGRhdGEsIHtcblxuXHRcdFx0dGhlbjogZnVuY3Rpb24gZmFrZVRoZW4oZm4pXG5cdFx0XHR7XG5cdFx0XHRcdGRlbGV0ZSAoZGF0YSBhcyBhbnkgYXMgSVJldHVyblZhbHVlU3luYzxUPikudGhlbjtcblxuXHRcdFx0XHRsZXQgcmV0ID0gZm4oZGF0YSk7XG5cblx0XHRcdFx0aGFuZGxlUHJvbWlzZShyZXQsIGRhdGEpO1xuXG5cdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHR9LFxuXG5cdFx0XHRjYXRjaDogZnVuY3Rpb24gZmFrZUNhdGNoKGZuKVxuXHRcdFx0e1xuXHRcdFx0XHRkZWxldGUgKGRhdGEgYXMgYW55IGFzIElSZXR1cm5WYWx1ZVN5bmM8VD4pLmNhdGNoO1xuXG5cdFx0XHRcdGxldCBlID0gbnVsbDtcblxuXHRcdFx0XHRpZiAoZGF0YS5lcnJEYXRhKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZSA9IF9lcnJvcihkYXRhLmVyckRhdGEpO1xuXG5cdFx0XHRcdFx0bGV0IHJldCA9IGZuKGUpO1xuXG5cdFx0XHRcdFx0aGFuZGxlUHJvbWlzZShyZXQsIGRhdGEpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gZGF0YVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHR0YXA6IGZ1bmN0aW9uIGZha2VUYXAoZm4pXG5cdFx0XHR7XG5cdFx0XHRcdGRlbGV0ZSAoZGF0YSBhcyBhbnkgYXMgSVJldHVyblZhbHVlU3luYzxUPikudGFwO1xuXG5cdFx0XHRcdGxldCByZXQgPSBmbihkYXRhKTtcblxuXHRcdFx0XHRpZiAoaGFuZGxlUHJvbWlzZShyZXQsIGRhdGEpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHJldC50aGVuKGZ1bmN0aW9uICgpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fSxcblx0XHRcdHRhcENhdGNoOiBmdW5jdGlvbiBmYWtlVGFwQ2F0Y2goZm4pXG5cdFx0XHR7XG5cdFx0XHRcdGxldCBlID0gbnVsbDtcblxuXHRcdFx0XHRkZWxldGUgKGRhdGEgYXMgYW55IGFzIElSZXR1cm5WYWx1ZVN5bmM8VD4pLnRhcENhdGNoO1xuXG5cdFx0XHRcdGlmIChkYXRhLmVyckRhdGEpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRlID0gX2Vycm9yKGRhdGEuZXJyRGF0YSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZXQgcmV0ID0gZm4oZSk7XG5cblx0XHRcdFx0aWYgKGhhbmRsZVByb21pc2UocmV0LCBkYXRhKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiByZXQudGhlbihmdW5jdGlvbiAoKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdH0sXG5cdFx0fSlcblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVByb21pc2UocmV0LCBkYXRhOiBJUmV0dXJuVmFsdWVTeW5jPFQ+IHwgSVJldHVyblZhbHVlPFQ+KVxuXHR7XG5cdFx0aWYgKHJldCAhPT0gZGF0YSAmJiBpc1Byb21pc2UocmV0KSlcblx0XHR7XG5cdFx0XHRkZWxldGUgKGRhdGEgYXMgYW55IGFzIElSZXR1cm5WYWx1ZVN5bmM8VD4pLnRhcDtcblx0XHRcdGRlbGV0ZSAoZGF0YSBhcyBhbnkgYXMgSVJldHVyblZhbHVlU3luYzxUPikudGFwQ2F0Y2g7XG5cdFx0XHRkZWxldGUgKGRhdGEgYXMgYW55IGFzIElSZXR1cm5WYWx1ZVN5bmM8VD4pLnRoZW47XG5cdFx0XHRkZWxldGUgKGRhdGEgYXMgYW55IGFzIElSZXR1cm5WYWx1ZVN5bmM8VD4pLmNhdGNoO1xuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxuZXhwb3J0IHtcblx0Z2xvYlNlYXJjaCBhcyBhc3luYyxcblx0Z2xvYlNlYXJjaFN5bmMgYXMgc3luYyxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJT3B0aW9uczxUIGV4dGVuZHMgRW50cnlJdGVtPiBleHRlbmRzIEZhc3RHbG9iLk9wdGlvbnM8VD5cbntcblx0Y3dkPzogc3RyaW5nLFxuXHRkZWVwPzogbnVtYmVyIHwgYm9vbGVhbjtcblxuXHQvKipcblx0ICogQGRlZmF1bHQgY3VycmVudCBwYWNrYWdlIHBhdGhcblx0ICovXG5cdHN0b3BQYXRoPzogc3RyaW5nIHwgc3RyaW5nW10gfCBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBAZGVmYXVsdCB0cnVlXG5cdCAqL1xuXHRmb2xsb3dTeW1saW5rZWREaXJlY3Rvcmllcz86IGJvb2xlYW4sXG5cblx0c29ydENvbXBhcmVGbj86IGJvb2xlYW4gfCAoKGE6IFQsIGI6IFQpID0+IG51bWJlciksXG5cblx0aWdub3JlPzogc3RyaW5nW10sXG5cblx0ZGlzYWJsZVRocm93V2hlbkVtcHR5PzogYm9vbGVhbixcblxuXHRwYXRoTGliPzogSVBhdGhMaWJCYXNlLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSZXR1cm5WYWx1ZTxUIGV4dGVuZHMgRW50cnlJdGVtPlxue1xuXHR2YWx1ZTogVFtdLFxuXHRjd2Q6IHN0cmluZyxcblxuXHRwYXR0ZXJuOiBzdHJpbmdbXSxcblx0b3B0aW9uczogSU9wdGlvbnNSdW50aW1lPFQ+LFxuXHRoaXN0b3J5OiBzdHJpbmdbXSxcblxuXHRlcnJEYXRhPzogUGFydGlhbDxJUmV0dXJuRXJyb3I8VD4+LFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSZXR1cm5WYWx1ZVN5bmM8VCBleHRlbmRzIEVudHJ5SXRlbT4gZXh0ZW5kcyBJUmV0dXJuVmFsdWU8VD5cbntcblx0dGhlbjxSPihmbjogKGRhdGE6IElSZXR1cm5WYWx1ZVN5bmM8VD4pID0+IFIpOiBSLFxuXHRjYXRjaDxSPihmbjogKGVycjogSVJldHVybkVycm9yPFQ+KSA9PiBSKTogSVJldHVyblZhbHVlU3luYzxUPiAmIFIsXG5cblx0dGFwKGZuOiAoZGF0YTogSVJldHVyblZhbHVlU3luYzxUPikgPT4gYW55KTogSVJldHVyblZhbHVlU3luYzxUPixcblx0dGFwQ2F0Y2goZm46IChlcnI6IElSZXR1cm5FcnJvcjxUPikgPT4gYW55KTogSVJldHVyblZhbHVlU3luYzxUPixcbn1cblxuZXhwb3J0IHR5cGUgSU9wdGlvbnNSdW50aW1lPFQgZXh0ZW5kcyBFbnRyeUl0ZW0+ID0gSVRTT3ZlcndyaXRlPElPcHRpb25zPFQ+LCB7XG5cdHNvcnRDb21wYXJlRm4/KGE6IFQsIGI6IFQpOiBudW1iZXIsXG5cdGlnbm9yZT86IHN0cmluZ1tdLFxuXHRzdG9wUGF0aD86IHN0cmluZ1tdO1xuXG5cdC8vcGF0aExpYj86IElQYXRoTGliQmFzZSAmIHR5cGVvZiBfcGF0aCAmIHR5cGVvZiBfdXBhdGgsXG59PlxuXG5leHBvcnQgaW50ZXJmYWNlIElQYXRoTGliQmFzZVxue1xuXHRzZXA6IHN0cmluZyxcblx0bm9ybWFsaXplKHBhdGg6IHN0cmluZyk6IHN0cmluZztcblx0cmVzb2x2ZSguLi5wYXRoczogc3RyaW5nW10pOiBzdHJpbmc7XG5cdGpvaW4oLi4ucGF0aHM6IHN0cmluZ1tdKTogc3RyaW5nO1xufVxuXG5cbmV4cG9ydCB0eXBlIElSZXR1cm5FcnJvcjxUIGV4dGVuZHMgRW50cnlJdGVtLCBFIGV4dGVuZHMgRXJyb3IgPSBFcnJvcj4gPSBFICYge1xuXHRtZXNzYWdlOiBzdHJpbmcsXG5cdF9kYXRhOiB7XG5cdFx0Y3dkOiBzdHJpbmcsXG5cblx0XHRwYXR0ZXJuOiBzdHJpbmdbXSxcblx0XHRvcHRpb25zOiBJT3B0aW9uc1J1bnRpbWU8VD4sXG5cblx0XHRoaXN0b3J5OiBzdHJpbmdbXSxcblx0fSxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvbWlzZTxUIGV4dGVuZHMgUHJvbWlzZTxhbnk+PihyZXQ6IFQpOiByZXQgaXMgVFxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvbWlzZTxUIGV4dGVuZHMgQmx1ZWJpcmQ8YW55Pj4ocmV0OiBUKTogcmV0IGlzIFRcbmV4cG9ydCBmdW5jdGlvbiBpc1Byb21pc2UocmV0KVxue1xuXHRpZiAoQmx1ZWJpcmQuaXMocmV0KSlcblx0e1xuXHRcdHJldHVybiB0cnVlXG5cdH1cblx0ZWxzZSBpZiAocmV0IGluc3RhbmNlb2YgUHJvbWlzZSlcblx0e1xuXHRcdHJldHVybiB0cnVlXG5cdH1cblxuXHRyZXR1cm4gZmFsc2Vcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZUFyZ3M8VCBleHRlbmRzIEVudHJ5SXRlbSA9IHN0cmluZz4ocGF0dGVybjogc3RyaW5nIHwgc3RyaW5nW10sIG9wdGlvbnM/OiBJT3B0aW9uczxUPik6IHtcblx0cGF0dGVybjogc3RyaW5nW10sXG5cdG9wdGlvbnM6IElPcHRpb25zUnVudGltZTxUPixcbn1cbntcblx0aWYgKHR5cGVvZiBwYXR0ZXJuID09PSAnc3RyaW5nJylcblx0e1xuXHRcdHBhdHRlcm4gPSBbcGF0dGVybl07XG5cdH1cblxuXHRleHBlY3QocGF0dGVybikuaXMuYW4oJ2FycmF5Jyk7XG5cblx0cGF0dGVybiA9IHBhdHRlcm4uZmlsdGVyKHYgPT4gdHlwZW9mIHYgPT09ICdzdHJpbmcnICYmIHYgIT09ICcnKTtcblxuXHRleHBlY3QocGF0dGVybikuaGF2ZS5sZW5ndGhPZi5ndCgwKTtcblxuXHRsZXQgb3B0cyA9IE9iamVjdC5hc3NpZ24oe1xuXHRcdGZvbGxvd1N5bWxpbmtlZERpcmVjdG9yaWVzOiB0cnVlLFxuXHRcdG1hcmtEaXJlY3RvcmllczogdHJ1ZSxcblx0XHR1bmlxdWU6IHRydWUsXG5cdFx0Y3dkOiBwcm9jZXNzLmN3ZCgpLFxuXHRcdC8vc3RvcFBhdGg6IFtdLFxuXHRcdGlnbm9yZTogW10sXG5cdH0sIG9wdGlvbnMgfHwge30pO1xuXG5cblx0ZXhwZWN0KG9wdHMuY3dkKS5pcy5hbignc3RyaW5nJyk7XG5cblx0b3B0cy5wYXRoTGliID0gb3B0cy5wYXRoTGliIHx8IF9wYXRoO1xuXHRjb25zdCBwYXRoID0gb3B0cy5wYXRoTGliIGFzIElPcHRpb25zUnVudGltZTxUPltcInBhdGhMaWJcIl07XG5cblx0ZXhwZWN0KHBhdGguam9pbikuaXMuYW4oJ2Z1bmN0aW9uJyk7XG5cdGV4cGVjdChwYXRoLnNlcCkuaXMuYW4oJ3N0cmluZycpO1xuXHRleHBlY3QocGF0aC5ub3JtYWxpemUpLmlzLmFuKCdmdW5jdGlvbicpO1xuXHRleHBlY3QocGF0aC5yZXNvbHZlKS5pcy5hbignZnVuY3Rpb24nKTtcblxuXHRsZXQgY3dkID0gcGF0aC5ub3JtYWxpemUob3B0cy5jd2QpO1xuXG5cdGlmIChjd2QgPT09ICcuJyB8fCBjd2QgPT09ICcuLicpXG5cdHtcblx0XHRjd2QgPSBwYXRoLnJlc29sdmUoY3dkKTtcblx0fVxuXG5cdG9wdHMuY3dkID0gY3dkO1xuXG5cdGlmIChvcHRzLnN0b3BQYXRoID09IG51bGwgfHwgb3B0cy5zdG9wUGF0aCA9PT0gdHJ1ZSlcblx0e1xuXHRcdG9wdHMuc3RvcFBhdGggPSBbcGtnRGlyLnN5bmMoY3dkKV07XG5cdH1cblx0ZWxzZSBpZiAodHlwZW9mIG9wdHMuc3RvcFBhdGggPT09ICdzdHJpbmcnKVxuXHR7XG5cdFx0b3B0cy5zdG9wUGF0aCA9IFtvcHRzLnN0b3BQYXRoXTtcblx0fVxuXHRlbHNlIGlmIChvcHRzLnN0b3BQYXRoID09PSBmYWxzZSlcblx0e1xuXHRcdG9wdHMuc3RvcFBhdGggPSBbXTtcblx0fVxuXG5cdGV4cGVjdChvcHRzLnN0b3BQYXRoKS5pcy5hbignYXJyYXknKTtcblxuXHRvcHRzLnN0b3BQYXRoID0gb3B0cy5zdG9wUGF0aC5tYXAodiA9PlxuXHR7XG5cblx0XHRpZiAodHlwZW9mIHYgIT09ICdzdHJpbmcnKVxuXHRcdHtcblx0XHRcdGV4cGVjdCh2LCBgb3B0aW9ucy5zdG9wUGF0aCBtdXN0IGlzIHN0cmluZyBvciBzdHJpbmdbXWApLmlzLmFuKCdzdHJpbmcnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGF0aC5ub3JtYWxpemUodilcblx0fSk7XG5cblx0aWYgKG9wdHMuaWdub3JlID09IG51bGwpXG5cdHtcblx0XHRvcHRzLmlnbm9yZSA9IFtdO1xuXHR9XG5cdGVsc2UgaWYgKHR5cGVvZiBvcHRzLmlnbm9yZSA9PT0gJ3N0cmluZycpXG5cdHtcblx0XHRvcHRzLmlnbm9yZSA9IFtvcHRzLmlnbm9yZV07XG5cdH1cblxuXHRleHBlY3Qob3B0cy5pZ25vcmUpLmlzLmFuKCdhcnJheScpO1xuXG5cdG9wdHMuaWdub3JlLmZvckVhY2godiA9PlxuXHR7XG5cdFx0aWYgKHR5cGVvZiB2ICE9PSAnc3RyaW5nJylcblx0XHR7XG5cdFx0XHRleHBlY3QodiwgYG9wdGlvbnMuaWdub3JlIG11c3QgaXMgc3RyaW5nW11gKS5pcy5hbignc3RyaW5nJyk7XG5cdFx0fVxuXHR9KTtcblxuXHRpZiAob3B0cy5zb3J0Q29tcGFyZUZuID09PSB0cnVlIHx8IG9wdHMuc29ydENvbXBhcmVGbiA9PSBudWxsKVxuXHR7XG5cdFx0b3B0cy5zb3J0Q29tcGFyZUZuID0gbmF0dXJhbENvbXBhcmU7XG5cdH1cblx0ZWxzZSBpZiAob3B0cy5zb3J0Q29tcGFyZUZuKVxuXHR7XG5cdFx0ZXhwZWN0KG9wdHMuc29ydENvbXBhcmVGbikuaXMuYW4oJ2Z1bmN0aW9uJyk7XG5cdH1cblx0ZWxzZVxuXHR7XG5cdFx0b3B0cy5zb3J0Q29tcGFyZUZuID0gbnVsbFxuXHR9XG5cblx0b3B0cy5kaXNhYmxlVGhyb3dXaGVuRW1wdHkgPSAhIW9wdHMuZGlzYWJsZVRocm93V2hlbkVtcHR5O1xuXG5cdHJldHVybiB7XG5cdFx0cGF0dGVybixcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0b3B0aW9uczogb3B0cyxcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX2Vycm9yPEUgZXh0ZW5kcyBFcnJvciwgRCBleHRlbmRzIGFueT4oZGF0YToge1xuXHRtZXNzYWdlPzogc3RyaW5nIHwgYW55LFxuXHRfZGF0YT86IEQsXG5cdC8vIEB0cy1pZ25vcmVcbn0sIEVycjogKG5ldyAoLi4uYXJncykgPT4gRSkgPSBFcnJvcik6IEUgJiB7XG5cdF9kYXRhPzogRFxufVxue1xuXHRsZXQgZSA9IG5ldyBFcnIoZGF0YS5tZXNzYWdlIHx8IGRhdGEuX2RhdGEpO1xuXHQvLyBAdHMtaWdub3JlXG5cdGUuX2RhdGEgPSBkYXRhLl9kYXRhO1xuXHQvLyBAdHMtaWdub3JlXG5cdHJldHVybiBlO1xufVxuXG5pbXBvcnQgR2xvYlNlYXJjaCA9IHJlcXVpcmUoJy4vaW5kZXgnKTtcbmV4cG9ydCBkZWZhdWx0IEdsb2JTZWFyY2hcbiJdfQ==