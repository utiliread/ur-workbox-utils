"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileDetails = exports.getCompositeDetails = exports.getStringDetails = void 0;
var crypto = require("crypto");
var fs = require("fs");
var glob = require("glob");
var upath = require("upath");
var hashing_1 = require("./hashing");
exports.getStringDetails = function (url, value) {
    return {
        file: url,
        hash: hashing_1.getDataHash(value),
        size: value.length,
    };
};
exports.getCompositeDetails = function (url, dependencyDetails) {
    var md5 = crypto.createHash("md5");
    var totalSize = 0;
    for (var _i = 0, dependencyDetails_1 = dependencyDetails; _i < dependencyDetails_1.length; _i++) {
        var details = dependencyDetails_1[_i];
        md5.update(details.hash);
        totalSize += details.size;
    }
    var hash = md5.digest("hex");
    return { file: url, hash: hash, size: totalSize };
};
exports.getFileDetails = function (globPattern, globOptions) {
    // See https://github.com/GoogleChrome/workbox/blob/master/packages/workbox-build/src/lib/get-file-details.js
    var globbedFiles = glob.sync(globPattern, {
        cwd: globOptions.globDirectory,
        follow: globOptions.globFollow,
        ignore: globOptions.globIgnores,
        strict: globOptions.globStrict,
    });
    var getFileSize = function (file) {
        var stat = fs.statSync(file);
        if (!stat.isFile()) {
            return null;
        }
        return stat.size;
    };
    var fileDetails = globbedFiles.map(function (file) {
        var fullPath = upath.join(globOptions.globDirectory, file);
        var size = getFileSize(fullPath);
        if (size === null) {
            return null;
        }
        var hash = hashing_1.getFileHash(fullPath);
        return { file: file, hash: hash, size: size };
    });
    // If !== null, means it's a valid file.
    var predicate = function (details) { return !!details; };
    var globbedFileDetails = fileDetails.filter(predicate);
    return globbedFileDetails;
};
//# sourceMappingURL=file-details.js.map