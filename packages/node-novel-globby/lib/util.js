"use strict";
/**
 * Created by user on 2019/5/6.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.foreachArrayDeepAsync = exports.foreachArrayDeep = exports.eachVolumeTitle = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const normalize_1 = require("@node-novel/normalize");
tslib_1.__exportStar(require("@lazy-glob/util/lib/types/glob"), exports);
function eachVolumeTitle(volume_title, strip = true) {
    let vs;
    if (Array.isArray(volume_title)) {
        vs = volume_title;
        volume_title = volume_title.join('/');
    }
    else {
        vs = volume_title
            .split('/');
    }
    if (strip) {
        vs = vs.map(t => (0, normalize_1.normalize_strip)(t, true));
    }
    let ret = {
        volume_title,
        level: vs.length,
        titles: [],
        titles_full: [],
    };
    let a;
    vs
        .forEach((b) => {
        ret.titles.push(b);
        if (a != null) {
            a += '/' + b;
        }
        else {
            a = b;
        }
        ret.titles_full.push(a);
    });
    return ret;
}
exports.eachVolumeTitle = eachVolumeTitle;
function foreachArrayDeep(arr, fn, initCache) {
    let topCache = {
        data: {},
        temp: {},
        ...initCache,
        deep: 0,
    };
    topCache.topCache = topCache;
    let ret = arr
        .map(((value, index, array) => {
        return fnDeep(value, index, array, topCache);
    }));
    function fnDeep(value, index, array, cache) {
        if (Array.isArray(value)) {
            return value.map((value, index, array) => {
                return fnDeep(value, index, array, {
                    ...cache,
                    deep: cache.deep + 1,
                });
            });
        }
        else {
            return fn({
                value, index, array,
                cache,
            });
        }
    }
    return {
        ret,
        data: topCache.data,
        temp: topCache.temp,
    };
}
exports.foreachArrayDeep = foreachArrayDeep;
function foreachArrayDeepAsync(arr, fn, initCache) {
    let topCache = {
        data: {},
        temp: {},
        ...initCache,
        deep: 0,
    };
    topCache.topCache = topCache;
    return bluebird_1.default.resolve(null)
        .then(async function () {
        let ret = await bluebird_1.default.resolve(arr)
            .then(array => {
            return bluebird_1.default.mapSeries(array, ((value, index) => {
                return fnDeep(value, index, array, topCache);
            }));
        });
        function fnDeep(value, index, array, cache) {
            if (Array.isArray(value)) {
                return bluebird_1.default.resolve(value)
                    .then(array => {
                    return bluebird_1.default.mapSeries(array, (value, index) => {
                        return fnDeep(value, index, array, {
                            ...cache,
                            deep: cache.deep + 1,
                        });
                    });
                });
            }
            else {
                return fn({
                    value, index, array,
                    cache,
                });
            }
        }
        return {
            ret,
            data: topCache.data,
            temp: topCache.temp,
        };
    });
}
exports.foreachArrayDeepAsync = foreachArrayDeepAsync;
//# sourceMappingURL=util.js.map