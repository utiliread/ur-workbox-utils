"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTemplatedURLs = void 0;
var file_details_1 = require("./file-details");
var defaultGlobOptions = {
    globDirectory: "./",
    globFollow: true,
    globIgnores: ["**/node_modules/**/*"],
    globStrict: true,
};
function addTemplatedURLs(templatedURLs, globOptions) {
    if (globOptions === void 0) { globOptions = {}; }
    var defaultedGlobOptions = Object.assign(defaultGlobOptions, globOptions);
    // See https://github.com/GoogleChrome/workbox/issues/2398#issuecomment-597080778
    // https://github.com/GoogleChrome/workbox/blob/master/packages/workbox-build/src/lib/get-file-manifest-entries.js
    var transform = function (manifestEntries) {
        var fileDetails = [];
        var warnings = [];
        for (var _i = 0, _a = Object.keys(templatedURLs); _i < _a.length; _i++) {
            var url = _a[_i];
            var dependencies = templatedURLs[url];
            if (Array.isArray(dependencies)) {
                var details = dependencies.reduce(function (accumulated, globPattern) {
                    var globbedFileDetails = (0, file_details_1.getFileDetails)(globPattern, defaultedGlobOptions);
                    if (globbedFileDetails.length === 0) {
                        warnings.push("Glob pattern '".concat(globPattern, "' did not resolve to any files"));
                    }
                    return accumulated.concat(globbedFileDetails);
                }, []);
                fileDetails.push((0, file_details_1.getCompositeDetails)(url, details));
            }
            else {
                fileDetails.push((0, file_details_1.getStringDetails)(url, dependencies));
            }
        }
        var manifest = manifestEntries.concat(fileDetails.map(function (x) {
            return {
                url: x.file,
                revision: x.hash,
                size: x.size,
            };
        }));
        var result = {
            manifest: manifest,
            warnings: warnings,
        };
        return result;
    };
    return transform;
}
exports.addTemplatedURLs = addTemplatedURLs;
//# sourceMappingURL=add-templated-urls.js.map