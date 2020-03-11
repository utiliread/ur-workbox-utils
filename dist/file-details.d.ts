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
export declare const getStringDetails: (url: string, value: string) => FileDetails;
export declare const getCompositeDetails: (url: string, dependencyDetails: FileDetails[]) => FileDetails;
export declare const getFileDetails: (globPattern: string, globOptions: GlobOptions) => FileDetails[];
