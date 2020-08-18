"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileHash = exports.getDataHash = void 0;
var crypto = require("crypto");
var fs = require("fs");
exports.getDataHash = function (data) {
    var md5 = crypto.createHash("md5");
    md5.update(data);
    return md5.digest("hex");
};
exports.getFileHash = function (file) {
    var buffer = fs.readFileSync(file);
    return exports.getDataHash(buffer);
};
//# sourceMappingURL=hashing.js.map