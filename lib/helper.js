"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StrUtil = require("str-util");
const zhjp_1 = require("novel-text/zhjp");
const chinese_convert_1 = require("chinese_convert");
const deromanize = require("deromanize");
exports.deromanize = deromanize;
function normalize_val(str, padNum = 5, options = {}) {
    padNum = padNum || options.padNum;
    str = zhjp_1.default.filename(str);
    str = StrUtil.toHalfWidth(str)
        .toLowerCase();
    str = StrUtil.trim(str, '　');
    str = StrUtil.zh2num(str, {
        truncateOne: 2,
    }).toString();
    if (options.checkRoman) {
        let m = isRoman(str);
        if (m) {
            let n = deromanize(normalizeRoman(m[1]));
            str = n.toString() + str.slice(m[1].length);
        }
    }
    str = str.replace(/\d+/g, function ($0) {
        return $0.padStart(padNum, '0');
    });
    str = str
        .replace(/^第+/, '')
        .replace(/\./g, '_')
        .replace(/[―—－──\-]/g, '_')
        .replace(/[\s　]/g, '_')
        .replace(/[・:]/g, '_')
        .replace(/_+/g, '_');
    str = StrUtil.zh2jp(chinese_convert_1.cn2tw(str), {
        safe: false,
    });
    return str;
}
exports.normalize_val = normalize_val;
function isRoman(str) {
    return /^([LCDMIVX\u2160-\u217f]+)(?![a-z\d])/ui.exec(str);
}
exports.isRoman = isRoman;
function normalizeRoman(input, bool) {
    let ro = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII',];
    for (let i = 0; i < 12; i++) {
        let r = new RegExp(String.fromCharCode(0x2160 + i) + '|' + String.fromCharCode(0x2160 + 16 + i), 'g');
        input = input.replace(r, bool ? String.fromCharCode(0x2160 + i) : ro[i]);
    }
    return input;
}
exports.normalizeRoman = normalizeRoman;
const self = require("./helper");
exports.default = self;
