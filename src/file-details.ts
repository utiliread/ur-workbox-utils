import * as crypto from "crypto";
import * as fs from "fs";
import * as glob from "glob";
import * as upath from "upath";

import { getDataHash, getFileHash } from "./hashing";

export interface FileDetails {
    file: string;
    hash: string;
    size: number;
}

export interface GlobOptions {
    globDirectory: string;
    globFollow: boolean;
    globIgnores: string[];
    globStrict: boolean;
}

export const getStringDetails = (url: string, value: string): FileDetails => {
    return {
        file: url,
        hash: getDataHash(value),
        size: value.length,
    };
};

export const getCompositeDetails = (url: string, dependencyDetails: FileDetails[]): FileDetails => {
    const md5 = crypto.createHash("md5");
    let totalSize = 0;

    for (const details of dependencyDetails) {
        md5.update(details.hash);
        totalSize += details.size;
    }

    const hash = md5.digest("hex");

    return { file: url, hash, size: totalSize };
};

export const getFileDetails = (globPattern: string, globOptions: GlobOptions): FileDetails[] => {
    // See https://github.com/GoogleChrome/workbox/blob/master/packages/workbox-build/src/lib/get-file-details.js

    const globbedFiles = glob.sync(globPattern, {
        cwd: globOptions.globDirectory,
        follow: globOptions.globFollow,
        ignore: globOptions.globIgnores,
        strict: globOptions.globStrict,
    });

    const getFileSize = (file: string): number | null => {
        const stat = fs.statSync(file);
        if (!stat.isFile()) {
            return null;
        }
        return stat.size;
    };

    const fileDetails = globbedFiles.map((file) => {
        const fullPath = upath.join(globOptions.globDirectory, file);
        const size = getFileSize(fullPath);
        if (size === null) {
            return null;
        }

        const hash = getFileHash(fullPath);

        return { file, hash, size };
    });

    // If !== null, means it's a valid file.
    const predicate = (details: FileDetails | null): details is FileDetails => !!details;
    const globbedFileDetails = fileDetails.filter(predicate);

    return globbedFileDetails;
};