import { GlobOptions } from "./file-details";
import type { ManifestTransform } from "workbox-build";
export declare function addTemplatedURLs(templatedURLs: {
    [url: string]: string | string[];
}, globOptions?: Partial<GlobOptions>): ManifestTransform;
