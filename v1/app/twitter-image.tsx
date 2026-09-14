/* X / Twitter reuses the same card. Keeping the image itself as a re-export
   means there is only ever one design to maintain.

   `runtime` is declared here rather than re-exported: Next reads that field by
   static analysis and cannot follow it through an `export ... from`. */
export const runtime = "nodejs";
export { default, alt, size, contentType } from "./opengraph-image";
