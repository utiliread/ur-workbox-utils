import {
  FileDetails,
  GlobOptions,
  getCompositeDetails,
  getFileDetails,
  getStringDetails,
} from "./file-details";
import type { ManifestTransform, ManifestTransformResult } from "workbox-build";

const defaultGlobOptions: GlobOptions = {
  globDirectory: "./",
  globFollow: true,
  globIgnores: ["**/node_modules/**/*"],
  globStrict: true,
};

export function addTemplatedURLs(
  templatedURLs: { [url: string]: string | string[] },
  globOptions: Partial<GlobOptions> = {}
): ManifestTransform {
  const defaultedGlobOptions = Object.assign(defaultGlobOptions, globOptions);

  // See https://github.com/GoogleChrome/workbox/issues/2398#issuecomment-597080778
  // https://github.com/GoogleChrome/workbox/blob/master/packages/workbox-build/src/lib/get-file-manifest-entries.js

  const transform: ManifestTransform = (manifestEntries) => {
    const fileDetails: FileDetails[] = [];
    const warnings: string[] = [];

    for (const url of Object.keys(templatedURLs)) {
      const dependencies = templatedURLs[url];

      if (Array.isArray(dependencies)) {
        const details = dependencies.reduce<FileDetails[]>(
          (accumulated, globPattern) => {
            const globbedFileDetails = getFileDetails(
              globPattern,
              defaultedGlobOptions
            );
            if (globbedFileDetails.length === 0) {
              warnings.push(
                `Glob pattern '${globPattern}' did not resolve to any files`
              );
            }
            return accumulated.concat(globbedFileDetails);
          },
          []
        );
        fileDetails.push(getCompositeDetails(url, details));
      } else {
        fileDetails.push(getStringDetails(url, dependencies));
      }
    }

    const manifest = manifestEntries.concat(
      fileDetails.map((x) => {
        return {
          url: x.file,
          revision: x.hash,
          size: x.size,
        };
      })
    );

    const result: ManifestTransformResult = {
      manifest,
      warnings,
    };
    return result;
  };
  return transform;
}
