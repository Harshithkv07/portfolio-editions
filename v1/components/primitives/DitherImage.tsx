import manifest from "@/public/dither/manifest.json";

type Entry = { width: number; height: number; widths: number[] };
const files = manifest as Record<string, Entry>;

/**
 * Renders a pre-dithered image from public/dither/.
 *
 * Uses a plain <picture> rather than next/image on purpose: these files are
 * already generated at fixed sizes by scripts/dither.mjs, and running them
 * through a resizing pipeline again would resample the dot grid and turn the
 * hard-edged halftone into grey mush. Explicit width and height are always
 * emitted so there is no layout shift.
 */
export default function DitherImage({
  name,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
}: {
  name: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const entry = files[name];

  if (!entry) {
    // A missing image should be obvious in development, not silently absent.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[DitherImage] "${name}" is not in public/dither/manifest.json. ` +
          `Add the source file to content/images/source/ and run: npm run dither`,
      );
    }
    return <div className={className} aria-hidden />;
  }

  const srcSet = (ext: string) =>
    entry.widths.map((w) => `/dither/${name}-${w}.${ext} ${w}w`).join(", ");

  return (
    <picture>
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        src={`/dither/${name}-${entry.widths[0]}.png`}
        srcSet={srcSet("png")}
        sizes={sizes}
        alt={alt}
        width={entry.width}
        height={entry.height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : undefined}
      />
    </picture>
  );
}
