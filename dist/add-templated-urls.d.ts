import { GlobOptions } from "./file-details";
interface ManifestEntry {
    url: string;
    revision: string;
}
export declare function addTemplatedURLs(templatedURLs: {
    [url: string]: string | (string[]);
}, globOptions?: Partial<GlobOptions>): (originalManifest: ReadonlyArray<ManifestEntry>) => {
    manifest: ManifestEntry[];
    warnings: string[];
};
export {};
