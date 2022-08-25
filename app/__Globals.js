import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

// Globals - No Window object

//__dirname - path to current directory
//__filename - file name
