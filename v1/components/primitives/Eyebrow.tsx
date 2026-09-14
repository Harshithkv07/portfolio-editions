/**
 * The small blue square plus uppercase mono label used to open every section
 * in the reference. Deliberately not a heading element — it is a label, and
 * the real heading follows it.
 */
export default function Eyebrow({
  children,
  tone = "light",
  className = "",
}: {
  children: React.ReactNode;
  /** "light" = blue square on a dark surface. "dark" = for light surfaces.
      "invert" = white square, for use on the blue panel. */
  tone?: "light" | "dark" | "invert";
  className?: string;
}) {
  const square =
    tone === "invert" ? "bg-white" : tone === "dark" ? "bg-blue" : "bg-blue";
  const text =
    tone === "invert"
      ? "text-white"
      : tone === "dark"
        ? "text-black"
        : "text-white";

  return (
    <p className={`t-micro flex items-center gap-2.5 ${text} ${className}`}>
      <span aria-hidden className={`inline-block size-2 ${square}`} />
      {children}
    </p>
  );
}
