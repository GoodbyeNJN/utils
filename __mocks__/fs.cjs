const { fs } = require("memfs");

for (const method of ["cpSync", "statfsSync"]) {
    if (typeof fs.__vol[method] === "function") {
        fs[method] = fs.__vol[method].bind(fs.__vol);
    }
}

module.exports = fs;
