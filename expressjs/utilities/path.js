import path from "path";
import { fileURLToPath } from "url";

const absDir = path.dirname(fileURLToPath(import.meta.url));

export const rootDir = path.join(absDir, "..");
export const viewsDir = path.join(rootDir, "views");
export const cssDir = path.join(rootDir, "css");
