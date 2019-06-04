"use strict";
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
exports.default = exports;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsK0JBQWdDO0FBQ2hDLHNDQUF1QztBQUN2QyxxQ0FBc0M7QUFDdEMsOEJBQStCO0FBRy9CLCtCQUE4QjtBQUM5Qix5REFBMEQ7QUFDMUQsa0NBQW1DO0FBR25DLFNBQWdCLFVBQVUsQ0FBK0IsT0FBMEIsRUFBRSxPQUFxQjtJQUV6RyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUV0RCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsT0FBd0MsQ0FBQztJQUU5RCxPQUFPLElBQUksUUFBUSxDQUFrQixLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBRTlELElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBdUIsQ0FBQztRQUU1RCxJQUFJLE9BQU8sR0FBYSxFQUFFLENBQUM7UUFDM0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWhCLElBQUksTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUM1QjtZQUNDLE9BQU8sSUFBSSxFQUNYO2dCQUNDLElBQUksR0FBRyxLQUFLLEdBQUcsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUMvQjtvQkFDQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDeEI7Z0JBRUQsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFbEIsbUJBQW1CO2dCQUVuQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztnQkFFZixJQUFJ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LEdBQUcsY0FBYyxDQUFDO0tBQ3BDO1NBQ0ksSUFBSSxJQUFJLENBQUMsYUFBYSxFQUMzQjtRQUNDLGFBQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM3QztTQUVEO1FBQ0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7S0FDekI7SUFFRCxJQUFJLENBQUMscUJBQXFCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztJQUUxRCxPQUFPO1FBQ04sT0FBTztRQUNQLGFBQWE7UUFDYixPQUFPLEVBQUUsSUFBSTtLQUNiLENBQUE7QUFDRixDQUFDO0FBcEhELGdDQW9IQztBQUVELFNBQWdCLE1BQU0sQ0FBaUMsSUFJdEQsRUFBRSxNQUE0QixLQUFLO0lBSW5DLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVDLGFBQWE7SUFDYixDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDckIsYUFBYTtJQUNiLE9BQU8sQ0FBQyxDQUFDO0FBQ1YsQ0FBQztBQWJELHdCQWFDO0FBRUQsa0JBQWUsT0FBbUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTgvMTIvNC8wMDQuXG4gKi9cblxuaW1wb3J0IGZzID0gcmVxdWlyZSgnZnMtZXh0cmEnKTtcbmltcG9ydCBGYXN0R2xvYiA9IHJlcXVpcmUoJ2Zhc3QtZ2xvYicpO1xuaW1wb3J0IEJsdWViaXJkID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbmltcG9ydCBfcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmltcG9ydCBfdXBhdGggPSByZXF1aXJlKCd1cGF0aDInKTtcbmltcG9ydCB7IEVudHJ5SXRlbSB9IGZyb20gJ2Zhc3QtZ2xvYi9vdXQvdHlwZXMvZW50cmllcyc7XG5pbXBvcnQgeyBleHBlY3QgfSBmcm9tICdjaGFpJztcbmltcG9ydCBuYXR1cmFsQ29tcGFyZSA9IHJlcXVpcmUoJ3N0cmluZy1uYXR1cmFsLWNvbXBhcmUnKTtcbmltcG9ydCBwa2dEaXIgPSByZXF1aXJlKCdwa2ctZGlyJyk7XG5pbXBvcnQgeyBJVFNPdmVyd3JpdGUsIElUU1Jlc29sdmFibGUgfSBmcm9tICd0cy10eXBlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdsb2JTZWFyY2g8VCBleHRlbmRzIEVudHJ5SXRlbSA9IHN0cmluZz4ocGF0dGVybjogc3RyaW5nIHwgc3RyaW5nW10sIG9wdGlvbnM/OiBJT3B0aW9uczxUPilcbntcblx0KHsgcGF0dGVybiwgb3B0aW9ucyB9ID0gaGFuZGxlQXJncyhwYXR0ZXJuLCBvcHRpb25zKSk7XG5cblx0Y29uc3QgcGF0aCA9IG9wdGlvbnMucGF0aExpYiBhcyBJT3B0aW9uc1J1bnRpbWU8VD5bXCJwYXRoTGliXCJdO1xuXG5cdHJldHVybiBuZXcgQmx1ZWJpcmQ8SVJldHVyblZhbHVlPFQ+Pihhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuXHR7XG5cdFx0bGV0IGN3ZCA9IF9wYXRoLm5vcm1hbGl6ZShvcHRpb25zLmN3ZCk7XG5cdFx0bGV0IG9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSBhcyBJT3B0aW9uc1J1bnRpbWU8VD47XG5cblx0XHRsZXQgaGlzdG9yeTogc3RyaW5nW10gPSBbXTtcblx0XHRsZXQgYm9vbCA9IHRydWU7XG5cblx0XHRpZiAoYXdhaXQgZnMucGF0aEV4aXN0cyhjd2QpKVxuXHRcdHtcblx0XHRcdHdoaWxlIChib29sKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAoY3dkID09PSAnLicgfHwgY3dkID09PSAnLi4nKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y3dkID0gcGF0aC5yZXNvbHZlKGN3ZCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRoaXN0b3J5LnB1c2goY3dkKTtcblxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKGN3ZCk7XG5cblx0XHRcdFx0b3B0cy5jd2QgPSBjd2Q7XG5cblx0XHRcdFx0bGV0IHZhbHVlID0gYXdhaXQgRmFzdEdsb2Jcblx0XHRcdFx0XHQuYXN5bmM8VD4ocGF0dGVybiwgb3B0cylcblx0XHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKGUpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Ym9vbCA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0XHRlLl9kYXRhID0ge1xuXHRcdFx0XHRcdFx0XHRjd2QsXG5cdFx0XHRcdFx0XHRcdHBhdHRlcm46IHBhdHRlcm4gYXMgc3RyaW5nW10sXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnM6IG9wdHMsXG5cdFx0XHRcdFx0XHRcdGhpc3RvcnksXG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHRyZWplY3QoZSk7XG5cdFx0XHRcdFx0fSkgYXMgVFtdXG5cdFx0XHRcdDtcblxuXHRcdFx0XHRpZiAoIWJvb2wpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodmFsdWUubGVuZ3RoKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKG9wdHMuc29ydENvbXBhcmVGbilcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR2YWx1ZS5zb3J0KG9wdHMuc29ydENvbXBhcmVGbik7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmVzb2x2ZSh7XG5cdFx0XHRcdFx0XHR2YWx1ZSxcblx0XHRcdFx0XHRcdGN3ZCxcblx0XHRcdFx0XHRcdHBhdHRlcm46IHBhdHRlcm4gYXMgc3RyaW5nW10sXG5cdFx0XHRcdFx0XHRvcHRpb25zOiBvcHRzLFxuXHRcdFx0XHRcdFx0aGlzdG9yeSxcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhjd2QpO1xuXG5cdFx0XHRcdGlmIChvcHRzLnN0b3BQYXRoLmluY2x1ZGVzKGN3ZCkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvL2Jvb2wgPSBmYWxzZTtcblx0XHRcdFx0XHRyZWplY3RGYWlsKGBzdG9wIHNlYXJjaCBhdCAke2N3ZH1gKTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Lypcblx0XHRcdFx0bGV0IHQgPSBwYXRoLnJlc29sdmUoY3dkKTtcblxuXHRcdFx0XHRvcHRzLmlnbm9yZS5wdXNoKGN3ZCArIHBhdGguc2VwKTtcblx0XHRcdFx0b3B0cy5pZ25vcmUucHVzaChjd2QgKyBwYXRoLnNlcCArICcqKicpO1xuXG5cdFx0XHRcdGlmICh0ICE9IGN3ZClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG9wdHMuaWdub3JlLnB1c2godCArIHBhdGguc2VwKTtcblx0XHRcdFx0XHRvcHRzLmlnbm9yZS5wdXNoKHQgKyBwYXRoLnNlcCArICcqKicpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCovXG5cblx0XHRcdFx0Y3dkID0gcGF0aC5yZXNvbHZlKGN3ZCwgJy4uJyk7XG5cblx0XHRcdFx0aWYgKGN3ZCA9PT0gb3B0cy5jd2QpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQvL2Jvb2wgPSBmYWxzZTtcblx0XHRcdFx0XHRyZWplY3RGYWlsKGB0aGVyZSBpcyBubyBhbnkgcGFyZW50IHBhdGg6ICR7Y3dkfWApO1xuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGJvb2wpXG5cdFx0XHR7XG5cdFx0XHRcdHJlamVjdEZhaWwoYHVua25vdyBlcnJvcmApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0cmVqZWN0RmFpbChgcGF0aCBub3QgZXhpc3RzICR7Y3dkfWApO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHJlamVjdEZhaWwobWVzc2FnZTogc3RyaW5nKVxuXHRcdHtcblx0XHRcdGJvb2wgPSBmYWxzZTtcblxuXHRcdFx0aWYgKG9wdHMuZGlzYWJsZVRocm93V2hlbkVtcHR5KVxuXHRcdFx0e1xuXHRcdFx0XHRyZXNvbHZlKHtcblx0XHRcdFx0XHR2YWx1ZTogW10sXG5cdFx0XHRcdFx0Y3dkLFxuXHRcdFx0XHRcdHBhdHRlcm46IHBhdHRlcm4gYXMgc3RyaW5nW10sXG5cdFx0XHRcdFx0b3B0aW9uczogb3B0cyxcblx0XHRcdFx0XHRoaXN0b3J5LFxuXHRcdFx0XHRcdGVyckRhdGE6IHtcblx0XHRcdFx0XHRcdG1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRfZGF0YToge1xuXHRcdFx0XHRcdFx0XHRjd2QsXG5cdFx0XHRcdFx0XHRcdHBhdHRlcm46IHBhdHRlcm4gYXMgc3RyaW5nW10sXG5cdFx0XHRcdFx0XHRcdG9wdGlvbnM6IG9wdHMsXG5cdFx0XHRcdFx0XHRcdGhpc3RvcnksXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSlcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0cmVqZWN0KF9lcnJvcih7XG5cdFx0XHRcdFx0bWVzc2FnZSxcblx0XHRcdFx0XHRfZGF0YToge1xuXHRcdFx0XHRcdFx0Y3dkLFxuXHRcdFx0XHRcdFx0cGF0dGVybjogcGF0dGVybiBhcyBzdHJpbmdbXSxcblx0XHRcdFx0XHRcdG9wdGlvbnM6IG9wdHMsXG5cdFx0XHRcdFx0XHRoaXN0b3J5LFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdsb2JTZWFyY2hTeW5jPFQgZXh0ZW5kcyBFbnRyeUl0ZW0gPSBzdHJpbmc+KHBhdHRlcm46IHN0cmluZyB8IHN0cmluZ1tdLCBvcHRpb25zPzogSU9wdGlvbnM8VD4pOiBJUmV0dXJuVmFsdWVTeW5jPFQ+XG57XG5cdCh7IHBhdHRlcm4sIG9wdGlvbnMgfSA9IGhhbmRsZUFyZ3MocGF0dGVybiwgb3B0aW9ucykpO1xuXG5cdGNvbnN0IHBhdGggPSBvcHRpb25zLnBhdGhMaWIgYXMgSU9wdGlvbnNSdW50aW1lPFQ+W1wicGF0aExpYlwiXTtcblxuXHRsZXQgY3dkID0gX3BhdGgubm9ybWFsaXplKG9wdGlvbnMuY3dkKTtcblx0bGV0IG9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSBhcyBJT3B0aW9uc1J1bnRpbWU8VD47XG5cblx0bGV0IGhpc3Rvcnk6IHN0cmluZ1tdID0gW107XG5cdGxldCBib29sID0gdHJ1ZTtcblxuXHRpZiAoZnMucGF0aEV4aXN0c1N5bmMoY3dkKSlcblx0e1xuXHRcdHdoaWxlIChib29sKVxuXHRcdHtcblx0XHRcdGlmIChjd2QgPT09ICcuJyB8fCBjd2QgPT09ICcuLicpXG5cdFx0XHR7XG5cdFx0XHRcdGN3ZCA9IHBhdGgucmVzb2x2ZShjd2QpO1xuXHRcdFx0fVxuXG5cdFx0XHRoaXN0b3J5LnB1c2goY3dkKTtcblxuXHRcdFx0Ly9jb25zb2xlLmxvZyhjd2QpO1xuXG5cdFx0XHRvcHRzLmN3ZCA9IGN3ZDtcblxuXHRcdFx0bGV0IHZhbHVlOiBUW107XG5cblx0XHRcdHRyeVxuXHRcdFx0e1xuXHRcdFx0XHR2YWx1ZSA9IEZhc3RHbG9iLnN5bmM8VD4ocGF0dGVybiwgb3B0cyk7XG5cdFx0XHR9XG5cdFx0XHRjYXRjaCAoZSlcblx0XHRcdHtcblx0XHRcdFx0cmV0dXJuIHJlamVjdEZhaWwoZSlcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFib29sKVxuXHRcdFx0e1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGlmICh2YWx1ZS5sZW5ndGgpXG5cdFx0XHR7XG5cdFx0XHRcdGlmIChvcHRzLnNvcnRDb21wYXJlRm4pXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR2YWx1ZS5zb3J0KG9wdHMuc29ydENvbXBhcmVGbik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gcmVzb2x2ZSh7XG5cdFx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdFx0Y3dkLFxuXHRcdFx0XHRcdHBhdHRlcm4sXG5cdFx0XHRcdFx0b3B0aW9uczogb3B0cyxcblx0XHRcdFx0XHRoaXN0b3J5LFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Ly9jb25zb2xlLmxvZyhjd2QpO1xuXG5cdFx0XHRpZiAob3B0cy5zdG9wUGF0aC5pbmNsdWRlcyhjd2QpKVxuXHRcdFx0e1xuXHRcdFx0XHQvL2Jvb2wgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuIHJlamVjdEZhaWwoYHN0b3Agc2VhcmNoIGF0ICR7Y3dkfWApO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHQvKlxuXHRcdFx0bGV0IHQgPSBwYXRoLnJlc29sdmUoY3dkKTtcblxuXHRcdFx0b3B0cy5pZ25vcmUucHVzaChjd2QgKyBwYXRoLnNlcCk7XG5cdFx0XHRvcHRzLmlnbm9yZS5wdXNoKGN3ZCArIHBhdGguc2VwICsgJyoqJyk7XG5cblx0XHRcdGlmICh0ICE9IGN3ZClcblx0XHRcdHtcblx0XHRcdFx0b3B0cy5pZ25vcmUucHVzaCh0ICsgcGF0aC5zZXApO1xuXHRcdFx0XHRvcHRzLmlnbm9yZS5wdXNoKHQgKyBwYXRoLnNlcCArICcqKicpO1xuXHRcdFx0fVxuXHRcdFx0Ki9cblxuXHRcdFx0Y3dkID0gcGF0aC5yZXNvbHZlKGN3ZCwgJy4uJyk7XG5cblx0XHRcdGlmIChjd2QgPT09IG9wdHMuY3dkKVxuXHRcdFx0e1xuXHRcdFx0XHQvL2Jvb2wgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuIHJlamVjdEZhaWwoYHRoZXJlIGlzIG5vIGFueSBwYXJlbnQgcGF0aDogJHtjd2R9YCk7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdHJldHVybiByZWplY3RGYWlsKGBwYXRoIG5vdCBleGlzdHMgJHtjd2R9YCk7XG5cdH1cblxuXHRyZXR1cm4gcmVqZWN0RmFpbChgdW5rbm93IGVycm9yYCk7XG5cblx0ZnVuY3Rpb24gcmVqZWN0RmFpbDxFIGV4dGVuZHMgc3RyaW5nIHwgRXJyb3I+KG1lc3NhZ2U6IEUpXG5cdHtcblx0XHRib29sID0gZmFsc2U7XG5cblx0XHRpZiAobWVzc2FnZSBpbnN0YW5jZW9mIEVycm9yKVxuXHRcdHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdG1lc3NhZ2UuX2RhdGEgPSB7XG5cdFx0XHRcdGN3ZCxcblx0XHRcdFx0cGF0dGVybixcblx0XHRcdFx0b3B0aW9uczogb3B0cyxcblx0XHRcdFx0aGlzdG9yeSxcblx0XHRcdH07XG5cblx0XHRcdHRocm93IG1lc3NhZ2U7XG5cdFx0fVxuXG5cdFx0aWYgKG9wdHMuZGlzYWJsZVRocm93V2hlbkVtcHR5KVxuXHRcdHtcblx0XHRcdHJldHVybiByZXNvbHZlKHtcblx0XHRcdFx0dmFsdWU6IFtdLFxuXHRcdFx0XHRjd2QsXG5cdFx0XHRcdHBhdHRlcm46IHBhdHRlcm4gYXMgc3RyaW5nW10sXG5cdFx0XHRcdG9wdGlvbnM6IG9wdHMsXG5cdFx0XHRcdGhpc3RvcnksXG5cdFx0XHRcdGVyckRhdGE6IHtcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0bWVzc2FnZSxcblx0XHRcdFx0XHRfZGF0YToge1xuXHRcdFx0XHRcdFx0Y3dkLFxuXHRcdFx0XHRcdFx0cGF0dGVybjogcGF0dGVybiBhcyBzdHJpbmdbXSxcblx0XHRcdFx0XHRcdG9wdGlvbnM6IG9wdHMsXG5cdFx0XHRcdFx0XHRoaXN0b3J5LFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdH0pXG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHR0aHJvdyBfZXJyb3Ioe1xuXHRcdFx0XHRtZXNzYWdlLFxuXHRcdFx0XHRfZGF0YToge1xuXHRcdFx0XHRcdGN3ZCxcblx0XHRcdFx0XHRwYXR0ZXJuOiBwYXR0ZXJuIGFzIHN0cmluZ1tdLFxuXHRcdFx0XHRcdG9wdGlvbnM6IG9wdHMsXG5cdFx0XHRcdFx0aGlzdG9yeSxcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gcmVzb2x2ZTxSIGV4dGVuZHMgSVJldHVyblZhbHVlPFQ+PihkYXRhOiBSKTogSVJldHVyblZhbHVlU3luYzxUPlxuXHR7XG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ24oZGF0YSwge1xuXG5cdFx0XHR0aGVuOiBmdW5jdGlvbiBmYWtlVGhlbihmbilcblx0XHRcdHtcblx0XHRcdFx0ZGVsZXRlIChkYXRhIGFzIGFueSBhcyBJUmV0dXJuVmFsdWVTeW5jPFQ+KS50aGVuO1xuXG5cdFx0XHRcdGxldCByZXQgPSBmbihkYXRhKTtcblxuXHRcdFx0XHRoYW5kbGVQcm9taXNlKHJldCwgZGF0YSk7XG5cblx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdH0sXG5cblx0XHRcdGNhdGNoOiBmdW5jdGlvbiBmYWtlQ2F0Y2goZm4pXG5cdFx0XHR7XG5cdFx0XHRcdGRlbGV0ZSAoZGF0YSBhcyBhbnkgYXMgSVJldHVyblZhbHVlU3luYzxUPikuY2F0Y2g7XG5cblx0XHRcdFx0bGV0IGUgPSBudWxsO1xuXG5cdFx0XHRcdGlmIChkYXRhLmVyckRhdGEpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRlID0gX2Vycm9yKGRhdGEuZXJyRGF0YSk7XG5cblx0XHRcdFx0XHRsZXQgcmV0ID0gZm4oZSk7XG5cblx0XHRcdFx0XHRoYW5kbGVQcm9taXNlKHJldCwgZGF0YSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHJldHVybiBkYXRhXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHRhcDogZnVuY3Rpb24gZmFrZVRhcChmbilcblx0XHRcdHtcblx0XHRcdFx0ZGVsZXRlIChkYXRhIGFzIGFueSBhcyBJUmV0dXJuVmFsdWVTeW5jPFQ+KS50YXA7XG5cblx0XHRcdFx0bGV0IHJldCA9IGZuKGRhdGEpO1xuXG5cdFx0XHRcdGlmIChoYW5kbGVQcm9taXNlKHJldCwgZGF0YSkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRyZXR1cm4gcmV0LnRoZW4oZnVuY3Rpb24gKClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9LFxuXHRcdFx0dGFwQ2F0Y2g6IGZ1bmN0aW9uIGZha2VUYXBDYXRjaChmbilcblx0XHRcdHtcblx0XHRcdFx0bGV0IGUgPSBudWxsO1xuXG5cdFx0XHRcdGRlbGV0ZSAoZGF0YSBhcyBhbnkgYXMgSVJldHVyblZhbHVlU3luYzxUPikudGFwQ2F0Y2g7XG5cblx0XHRcdFx0aWYgKGRhdGEuZXJyRGF0YSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGUgPSBfZXJyb3IoZGF0YS5lcnJEYXRhKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCByZXQgPSBmbihlKTtcblxuXHRcdFx0XHRpZiAoaGFuZGxlUHJvbWlzZShyZXQsIGRhdGEpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cmV0dXJuIHJldC50aGVuKGZ1bmN0aW9uICgpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fSxcblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gaGFuZGxlUHJvbWlzZShyZXQsIGRhdGE6IElSZXR1cm5WYWx1ZVN5bmM8VD4gfCBJUmV0dXJuVmFsdWU8VD4pXG5cdHtcblx0XHRpZiAocmV0ICE9PSBkYXRhICYmIGlzUHJvbWlzZShyZXQpKVxuXHRcdHtcblx0XHRcdGRlbGV0ZSAoZGF0YSBhcyBhbnkgYXMgSVJldHVyblZhbHVlU3luYzxUPikudGFwO1xuXHRcdFx0ZGVsZXRlIChkYXRhIGFzIGFueSBhcyBJUmV0dXJuVmFsdWVTeW5jPFQ+KS50YXBDYXRjaDtcblx0XHRcdGRlbGV0ZSAoZGF0YSBhcyBhbnkgYXMgSVJldHVyblZhbHVlU3luYzxUPikudGhlbjtcblx0XHRcdGRlbGV0ZSAoZGF0YSBhcyBhbnkgYXMgSVJldHVyblZhbHVlU3luYzxUPikuY2F0Y2g7XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5leHBvcnQge1xuXHRnbG9iU2VhcmNoIGFzIGFzeW5jLFxuXHRnbG9iU2VhcmNoU3luYyBhcyBzeW5jLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElPcHRpb25zPFQgZXh0ZW5kcyBFbnRyeUl0ZW0+IGV4dGVuZHMgRmFzdEdsb2IuT3B0aW9uczxUPlxue1xuXHRjd2Q/OiBzdHJpbmcsXG5cdGRlZXA/OiBudW1iZXIgfCBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBAZGVmYXVsdCBjdXJyZW50IHBhY2thZ2UgcGF0aFxuXHQgKi9cblx0c3RvcFBhdGg/OiBzdHJpbmcgfCBzdHJpbmdbXSB8IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIEBkZWZhdWx0IHRydWVcblx0ICovXG5cdGZvbGxvd1N5bWxpbmtlZERpcmVjdG9yaWVzPzogYm9vbGVhbixcblxuXHRzb3J0Q29tcGFyZUZuPzogYm9vbGVhbiB8ICgoYTogVCwgYjogVCkgPT4gbnVtYmVyKSxcblxuXHRpZ25vcmU/OiBzdHJpbmdbXSxcblxuXHRkaXNhYmxlVGhyb3dXaGVuRW1wdHk/OiBib29sZWFuLFxuXG5cdHBhdGhMaWI/OiBJUGF0aExpYkJhc2UsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJldHVyblZhbHVlPFQgZXh0ZW5kcyBFbnRyeUl0ZW0+XG57XG5cdHZhbHVlOiBUW10sXG5cdGN3ZDogc3RyaW5nLFxuXG5cdHBhdHRlcm46IHN0cmluZ1tdLFxuXHRvcHRpb25zOiBJT3B0aW9uc1J1bnRpbWU8VD4sXG5cdGhpc3Rvcnk6IHN0cmluZ1tdLFxuXG5cdGVyckRhdGE/OiBQYXJ0aWFsPElSZXR1cm5FcnJvcjxUPj4sXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJldHVyblZhbHVlU3luYzxUIGV4dGVuZHMgRW50cnlJdGVtPiBleHRlbmRzIElSZXR1cm5WYWx1ZTxUPlxue1xuXHR0aGVuPFI+KGZuOiAoZGF0YTogSVJldHVyblZhbHVlU3luYzxUPikgPT4gUik6IFIsXG5cdGNhdGNoPFI+KGZuOiAoZXJyOiBJUmV0dXJuRXJyb3I8VD4pID0+IFIpOiBJUmV0dXJuVmFsdWVTeW5jPFQ+ICYgUixcblxuXHR0YXAoZm46IChkYXRhOiBJUmV0dXJuVmFsdWVTeW5jPFQ+KSA9PiBhbnkpOiBJUmV0dXJuVmFsdWVTeW5jPFQ+LFxuXHR0YXBDYXRjaChmbjogKGVycjogSVJldHVybkVycm9yPFQ+KSA9PiBhbnkpOiBJUmV0dXJuVmFsdWVTeW5jPFQ+LFxufVxuXG5leHBvcnQgdHlwZSBJT3B0aW9uc1J1bnRpbWU8VCBleHRlbmRzIEVudHJ5SXRlbT4gPSBJVFNPdmVyd3JpdGU8SU9wdGlvbnM8VD4sIHtcblx0c29ydENvbXBhcmVGbj8oYTogVCwgYjogVCk6IG51bWJlcixcblx0aWdub3JlPzogc3RyaW5nW10sXG5cdHN0b3BQYXRoPzogc3RyaW5nW107XG5cblx0Ly9wYXRoTGliPzogSVBhdGhMaWJCYXNlICYgdHlwZW9mIF9wYXRoICYgdHlwZW9mIF91cGF0aCxcbn0+XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVBhdGhMaWJCYXNlXG57XG5cdHNlcDogc3RyaW5nLFxuXHRub3JtYWxpemUocGF0aDogc3RyaW5nKTogc3RyaW5nO1xuXHRyZXNvbHZlKC4uLnBhdGhzOiBzdHJpbmdbXSk6IHN0cmluZztcblx0am9pbiguLi5wYXRoczogc3RyaW5nW10pOiBzdHJpbmc7XG59XG5cblxuZXhwb3J0IHR5cGUgSVJldHVybkVycm9yPFQgZXh0ZW5kcyBFbnRyeUl0ZW0sIEUgZXh0ZW5kcyBFcnJvciA9IEVycm9yPiA9IEUgJiB7XG5cdG1lc3NhZ2U6IHN0cmluZyxcblx0X2RhdGE6IHtcblx0XHRjd2Q6IHN0cmluZyxcblxuXHRcdHBhdHRlcm46IHN0cmluZ1tdLFxuXHRcdG9wdGlvbnM6IElPcHRpb25zUnVudGltZTxUPixcblxuXHRcdGhpc3Rvcnk6IHN0cmluZ1tdLFxuXHR9LFxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9taXNlPFQgZXh0ZW5kcyBQcm9taXNlPGFueT4+KHJldDogVCk6IHJldCBpcyBUXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9taXNlPFQgZXh0ZW5kcyBCbHVlYmlyZDxhbnk+PihyZXQ6IFQpOiByZXQgaXMgVFxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvbWlzZShyZXQpXG57XG5cdGlmIChCbHVlYmlyZC5pcyhyZXQpKVxuXHR7XG5cdFx0cmV0dXJuIHRydWVcblx0fVxuXHRlbHNlIGlmIChyZXQgaW5zdGFuY2VvZiBQcm9taXNlKVxuXHR7XG5cdFx0cmV0dXJuIHRydWVcblx0fVxuXG5cdHJldHVybiBmYWxzZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlQXJnczxUIGV4dGVuZHMgRW50cnlJdGVtID0gc3RyaW5nPihwYXR0ZXJuOiBzdHJpbmcgfCBzdHJpbmdbXSwgb3B0aW9ucz86IElPcHRpb25zPFQ+KToge1xuXHRwYXR0ZXJuOiBzdHJpbmdbXSxcblx0b3B0aW9uczogSU9wdGlvbnNSdW50aW1lPFQ+LFxufVxue1xuXHRpZiAodHlwZW9mIHBhdHRlcm4gPT09ICdzdHJpbmcnKVxuXHR7XG5cdFx0cGF0dGVybiA9IFtwYXR0ZXJuXTtcblx0fVxuXG5cdGV4cGVjdChwYXR0ZXJuKS5pcy5hbignYXJyYXknKTtcblxuXHRwYXR0ZXJuID0gcGF0dGVybi5maWx0ZXIodiA9PiB0eXBlb2YgdiA9PT0gJ3N0cmluZycgJiYgdiAhPT0gJycpO1xuXG5cdGV4cGVjdChwYXR0ZXJuKS5oYXZlLmxlbmd0aE9mLmd0KDApO1xuXG5cdGxldCBvcHRzID0gT2JqZWN0LmFzc2lnbih7XG5cdFx0Zm9sbG93U3ltbGlua2VkRGlyZWN0b3JpZXM6IHRydWUsXG5cdFx0bWFya0RpcmVjdG9yaWVzOiB0cnVlLFxuXHRcdHVuaXF1ZTogdHJ1ZSxcblx0XHRjd2Q6IHByb2Nlc3MuY3dkKCksXG5cdFx0Ly9zdG9wUGF0aDogW10sXG5cdFx0aWdub3JlOiBbXSxcblx0fSwgb3B0aW9ucyB8fCB7fSk7XG5cblxuXHRleHBlY3Qob3B0cy5jd2QpLmlzLmFuKCdzdHJpbmcnKTtcblxuXHRvcHRzLnBhdGhMaWIgPSBvcHRzLnBhdGhMaWIgfHwgX3BhdGg7XG5cdGNvbnN0IHBhdGggPSBvcHRzLnBhdGhMaWIgYXMgSU9wdGlvbnNSdW50aW1lPFQ+W1wicGF0aExpYlwiXTtcblxuXHRleHBlY3QocGF0aC5qb2luKS5pcy5hbignZnVuY3Rpb24nKTtcblx0ZXhwZWN0KHBhdGguc2VwKS5pcy5hbignc3RyaW5nJyk7XG5cdGV4cGVjdChwYXRoLm5vcm1hbGl6ZSkuaXMuYW4oJ2Z1bmN0aW9uJyk7XG5cdGV4cGVjdChwYXRoLnJlc29sdmUpLmlzLmFuKCdmdW5jdGlvbicpO1xuXG5cdGxldCBjd2QgPSBwYXRoLm5vcm1hbGl6ZShvcHRzLmN3ZCk7XG5cblx0aWYgKGN3ZCA9PT0gJy4nIHx8IGN3ZCA9PT0gJy4uJylcblx0e1xuXHRcdGN3ZCA9IHBhdGgucmVzb2x2ZShjd2QpO1xuXHR9XG5cblx0b3B0cy5jd2QgPSBjd2Q7XG5cblx0aWYgKG9wdHMuc3RvcFBhdGggPT0gbnVsbCB8fCBvcHRzLnN0b3BQYXRoID09PSB0cnVlKVxuXHR7XG5cdFx0bGV0IHJvb3QgPSBwa2dEaXIuc3luYyhjd2QpO1xuXG5cdFx0b3B0cy5zdG9wUGF0aCA9IFtdO1xuXHRcdGlmIChyb290KVxuXHRcdHtcblx0XHRcdG9wdHMuc3RvcFBhdGgucHVzaChyb290KTtcblx0XHR9XG5cdH1cblx0ZWxzZSBpZiAodHlwZW9mIG9wdHMuc3RvcFBhdGggPT09ICdzdHJpbmcnKVxuXHR7XG5cdFx0b3B0cy5zdG9wUGF0aCA9IFtvcHRzLnN0b3BQYXRoXTtcblx0fVxuXHRlbHNlIGlmIChvcHRzLnN0b3BQYXRoID09PSBmYWxzZSlcblx0e1xuXHRcdG9wdHMuc3RvcFBhdGggPSBbXTtcblx0fVxuXG5cdGV4cGVjdChvcHRzLnN0b3BQYXRoKS5pcy5hbignYXJyYXknKTtcblxuXHRvcHRzLnN0b3BQYXRoID0gb3B0cy5zdG9wUGF0aC5tYXAodiA9PlxuXHR7XG5cblx0XHRpZiAodHlwZW9mIHYgIT09ICdzdHJpbmcnKVxuXHRcdHtcblx0XHRcdGV4cGVjdCh2LCBgb3B0aW9ucy5zdG9wUGF0aCBtdXN0IGlzIHN0cmluZyBvciBzdHJpbmdbXWApLmlzLmFuKCdzdHJpbmcnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcGF0aC5ub3JtYWxpemUodilcblx0fSk7XG5cblx0aWYgKG9wdHMuaWdub3JlID09IG51bGwpXG5cdHtcblx0XHRvcHRzLmlnbm9yZSA9IFtdO1xuXHR9XG5cdGVsc2UgaWYgKHR5cGVvZiBvcHRzLmlnbm9yZSA9PT0gJ3N0cmluZycpXG5cdHtcblx0XHRvcHRzLmlnbm9yZSA9IFtvcHRzLmlnbm9yZV07XG5cdH1cblxuXHRleHBlY3Qob3B0cy5pZ25vcmUpLmlzLmFuKCdhcnJheScpO1xuXG5cdG9wdHMuaWdub3JlLmZvckVhY2godiA9PlxuXHR7XG5cdFx0aWYgKHR5cGVvZiB2ICE9PSAnc3RyaW5nJylcblx0XHR7XG5cdFx0XHRleHBlY3QodiwgYG9wdGlvbnMuaWdub3JlIG11c3QgaXMgc3RyaW5nW11gKS5pcy5hbignc3RyaW5nJyk7XG5cdFx0fVxuXHR9KTtcblxuXHRpZiAob3B0cy5zb3J0Q29tcGFyZUZuID09PSB0cnVlIHx8IG9wdHMuc29ydENvbXBhcmVGbiA9PSBudWxsKVxuXHR7XG5cdFx0b3B0cy5zb3J0Q29tcGFyZUZuID0gbmF0dXJhbENvbXBhcmU7XG5cdH1cblx0ZWxzZSBpZiAob3B0cy5zb3J0Q29tcGFyZUZuKVxuXHR7XG5cdFx0ZXhwZWN0KG9wdHMuc29ydENvbXBhcmVGbikuaXMuYW4oJ2Z1bmN0aW9uJyk7XG5cdH1cblx0ZWxzZVxuXHR7XG5cdFx0b3B0cy5zb3J0Q29tcGFyZUZuID0gbnVsbFxuXHR9XG5cblx0b3B0cy5kaXNhYmxlVGhyb3dXaGVuRW1wdHkgPSAhIW9wdHMuZGlzYWJsZVRocm93V2hlbkVtcHR5O1xuXG5cdHJldHVybiB7XG5cdFx0cGF0dGVybixcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0b3B0aW9uczogb3B0cyxcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gX2Vycm9yPEUgZXh0ZW5kcyBFcnJvciwgRCBleHRlbmRzIGFueT4oZGF0YToge1xuXHRtZXNzYWdlPzogc3RyaW5nIHwgYW55LFxuXHRfZGF0YT86IEQsXG5cdC8vIEB0cy1pZ25vcmVcbn0sIEVycjogKG5ldyAoLi4uYXJncykgPT4gRSkgPSBFcnJvcik6IEUgJiB7XG5cdF9kYXRhPzogRFxufVxue1xuXHRsZXQgZSA9IG5ldyBFcnIoZGF0YS5tZXNzYWdlIHx8IGRhdGEuX2RhdGEpO1xuXHQvLyBAdHMtaWdub3JlXG5cdGUuX2RhdGEgPSBkYXRhLl9kYXRhO1xuXHQvLyBAdHMtaWdub3JlXG5cdHJldHVybiBlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBleHBvcnRzIGFzIHR5cGVvZiBpbXBvcnQoJy4vaW5kZXgnKVxuIl19