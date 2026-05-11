import path from "path";
import { fileURLToPath } from "url";

const absDir = path.dirname(fileURLToPath(import.meta.url));

export const rootDir = path.join(absDir, "..");
export const certDir = path.join(rootDir, "certs");
export const publicDir = path.join(rootDir, "public");
export const imagesDir = path.join(publicDir, "images");
export const logsDir = path.join(publicDir, "logs");
