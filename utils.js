import { createRequire } from "module";
const require = createRequire(import.meta.url);

export function readJSON(path) {
  return require(path);
}
