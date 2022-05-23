"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileHash = exports.getDataHash = void 0;
var crypto = require("crypto");
var fs = require("fs");
var getDataHash = function (data) {
    var md5 = crypto.createHash("md5");
    md5.update(data);
    return md5.digest("hex");
};
exports.getDataHash = getDataHash;
var getFileHash = function (file) {
    var buffer = fs.readFileSync(file);
    return (0, exports.getDataHash)(buffer);
};
exports.getFileHash = getFileHash;
//# sourceMappingURL=hashing.js.map