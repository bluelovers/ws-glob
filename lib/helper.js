"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StrUtil = require("str-util");
const zhjp_1 = require("novel-text/zhjp");
const chinese_convert_1 = require("chinese_convert");
function normalize_val(str, padNum = 4) {
    str = zhjp_1.default.filename(str);
    str = StrUtil.toHalfWidth(str);
    str = StrUtil.trim(str, '　');
    str = StrUtil.zh2num(str, {
        truncateOne: 2,
    }).toString();
    str = str.replace(/\d+/g, function ($0) {
        return $0.padStart(padNum, '0');
    });
    str = str
        .replace(/\./g, '_')
        .replace(/[―—一－──\-]/g, '_')
        .replace(/\s/g, '_')
        .replace(/[・]/g, '_')
        .replace(/_+/g, '_');
    str = StrUtil.zh2jp(chinese_convert_1.cn2tw(str), {
        safe: false,
    });
    return str;
}
exports.normalize_val = normalize_val;
const self = require("./helper");
exports.default = self;
