import * as crypto from "crypto";
import * as fs from "fs";

export const getDataHash = (data: Buffer | string): string => {
  const md5 = crypto.createHash("md5");
  md5.update(data);
  return md5.digest("hex");
};

export const getFileHash = (file: string): string => {
  const buffer = fs.readFileSync(file);
  return getDataHash(buffer);
};
