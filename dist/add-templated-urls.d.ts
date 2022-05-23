import { GlobOptions } from "./file-details";
export interface ManifestEntry {
    revision: string;
    url: string;
}
declare type WebpackManifestTransform = (originalManifest: ReadonlyArray<ManifestEntry & {
    size: number;
}>) => {
    manifest: (ManifestEntry & {
        size: number;
    })[];
    warnings?: string[] | undefined;
};
export declare function addTemplatedURLs(templatedURLs: {
    [url: string]: string | string[];
}, globOptions?: Partial<GlobOptions>): WebpackManifestTransform;
export {};
