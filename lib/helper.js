"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StrUtil = require("str-util");
const deromanize = require("deromanize");
exports.deromanize = deromanize;
const cjk_conv_1 = require("cjk-conv");
function normalize_val(str, padNum = 5, options = {}) {
    padNum = padNum || options.padNum;
    str = cjk_conv_1.novelFilename.filename(str);
    if (/^(?:序|プロローグ|Prologue)/i.test(str)) {
        str = '0_' + str;
    }
    str = str.replace(/^(web)版(\d+)/i, '$1$2');
    str = StrUtil.toHalfWidth(str)
        .toLowerCase();
    str = StrUtil.trim(str, '　');
    str = StrUtil.zh2num(str);
    str = StrUtil.zh2num(str, {
        truncateOne: 2,
        flags: 'ug',
    }).toString();
    if (options.checkRoman) {
        let m = isRoman(str);
        if (m) {
            let n = deromanize(normalizeRoman(m[1]));
            str = n.toString() + str.slice(m[1].length);
        }
    }
    str = circle2num(str);
    str = str.replace(/\d+/g, function ($0) {
        return $0.padStart(padNum, '0');
    });
    str = str
        .replace(/^第+/, '')
        .replace(/[―—－──\-―—─＝=]/g, '_')
        .replace(/[\s　]/g, '_')
        .replace(/[\(\)〔［【《（「『』」》）】〕］]/g, '_')
        .replace(/[·‧・···•]/g, '_')
        .replace(/[：：︰﹕：]/ug, '_')
        .replace(/[・:,]/g, '_')
        .replace(/_+/g, '_');
    str = cjk_conv_1.zh2jp(cjk_conv_1.cn2tw(str), {
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
function circle2num(str) {
    str = str
        .replace(new RegExp(String.fromCharCode(9450), 'g'), '0');
    for (let n = 1; n <= 20; n++) {
        str = str
            .replace(new RegExp(String.fromCharCode(9312 + n - 1), 'g'), n);
    }
    for (let n = 21; n <= 35; n++) {
        str = str
            .replace(new RegExp(String.fromCharCode(12881 + n - 21), 'g'), n);
    }
    for (let n = 36; n <= 50; n++) {
        str = str
            .replace(new RegExp(String.fromCharCode(12977 + n - 36), 'g'), n);
    }
    for (let n = 1; n <= 10; n++) {
        str = str
            .replace(new RegExp(String.fromCharCode(0x24ea + n - 1), 'g'), n);
    }
    str = str
        .replace(new RegExp(String.fromCharCode(0x24ff), 'g'), '0');
    for (let n = 1; n <= 10; n++) {
        str = str
            .replace(new RegExp(String.fromCharCode(0x2776 + n - 1), 'g'), n);
    }
    for (let n = 1; n <= 10; n++) {
        str = str
            .replace(new RegExp(String.fromCharCode(0x278a + n - 1), 'g'), n);
    }
    for (let n = 11; n <= 20; n++) {
        str = str
            .replace(new RegExp(String.fromCharCode(0x24eb + n - 1), 'g'), n);
    }
    for (let n = 1; n <= 10; n++) {
        str = str
            .replace(new RegExp(String.fromCharCode(0x24f5 + n - 1), 'g'), n);
    }
    return str;
}
exports.circle2num = circle2num;
const self = require("./helper");
exports.default = self;
