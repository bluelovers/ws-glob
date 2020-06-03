"use strict";
/**
 * Created by user on 2018/12/4/004.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._error = exports.handleArgs = exports.isPromise = exports.sync = exports.async = exports.globSearchSync = exports.globSearch = void 0;
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
//# sourceMappingURL=index.js.map