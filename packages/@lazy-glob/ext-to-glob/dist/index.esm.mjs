import { escapeRegExp as e } from "regexp-helper-core";

function removeDot(e) {
  return e.replace(/^\./, "");
}

function removeDotFromExtensions(e, o) {
  return e.map((e => (e = removeDot(e), null == o || o.forEach((o => {
    e = o(e);
  })), e)));
}

function extToGlob(e) {
  return `.+(${removeDotFromExtensions(e).join("|")})`;
}

function extToRegexpPattern(o) {
  return `.(${removeDotFromExtensions(o, [ e ]).join("|")})$`;
}

export { extToGlob as default, extToGlob, extToRegexpPattern, removeDot, removeDotFromExtensions };
//# sourceMappingURL=index.esm.mjs.map
