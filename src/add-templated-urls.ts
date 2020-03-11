import { FileDetails, GlobOptions, getCompositeDetails, getFileDetails, getStringDetails } from "./file-details";

interface ManifestEntry {
    url: string;
    revision: string;
}

const defaultGlobOptions: GlobOptions = {
    globDirectory: "./",
    globFollow: true,
    globIgnores: ["**/node_modules/**/*"],
    globStrict: true,
};

export function addTemplatedURLs(templatedURLs: { [url: string]: string | (string[]) },
                                 globOptions: Partial<GlobOptions> = {}): (originalManifest: ReadonlyArray<ManifestEntry>) => { manifest: ManifestEntry[]; warnings: string[] } {
    const defaultedGlobOptions = Object.assign(defaultGlobOptions, globOptions);

    // See https://github.com/GoogleChrome/workbox/issues/2398#issuecomment-597080778
    // https://github.com/GoogleChrome/workbox/blob/master/packages/workbox-build/src/lib/get-file-manifest-entries.js

    return (originalManifest: ReadonlyArray<ManifestEntry>): { manifest: ManifestEntry[]; warnings: string[] } => {
        const fileDetails: FileDetails[] = [];
        const warnings: string[] = [];

        for (const url of Object.keys(templatedURLs)) {
            const dependencies = templatedURLs[url];

            if (Array.isArray(dependencies)) {
                const details = dependencies.reduce<FileDetails[]>((accumulated, globPattern) => {
                    const globbedFileDetails = getFileDetails(globPattern, defaultedGlobOptions);
                    if (globbedFileDetails.length === 0) {
                        warnings.push(`Glob pattern '${globPattern}' did not resolve to any files`);
                    }
                    return accumulated.concat(globbedFileDetails);
                }, []);
                fileDetails.push(getCompositeDetails(url, details));
            } else {
                fileDetails.push(getStringDetails(url, dependencies));
            }
        }

        const manifest = fileDetails.map(x => {
            return {
                url: x.file,
                revision: x.hash,
            };
        }).concat(originalManifest);

        return { manifest, warnings };
    };
}