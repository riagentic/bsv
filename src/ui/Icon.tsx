// Line icons (from mdview): 24×24, stroke-only, drawn in currentColor.
import type { JSX } from "aio";

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

const GLYPHS = {
  back: ["M15 18l-6-6 6-6"],
  chevronDown: ["M7 10l5 5 5-5"],
  chevronRight: ["M10 7l5 5-5 5"],
  sun: [
    circle(12, 12, 4),
    "M12 2.5v2",
    "M12 19.5v2",
    "M5.3 5.3l1.4 1.4",
    "M17.3 17.3l1.4 1.4",
    "M2.5 12h2",
    "M19.5 12h2",
    "M5.3 18.7l1.4-1.4",
    "M17.3 6.7l1.4-1.4",
  ],
  moon: ["M20.5 13.5A8.5 8.5 0 1 1 10.5 3.5a6.5 6.5 0 0 0 10 10z"],
  minus: ["M6 12h12"],
  plus: ["M12 6v12", "M6 12h12"],
  close: ["M6 6l12 12", "M18 6L6 18"],
  dict: [
    "M2 4.5h6a4 4 0 0 1 4 4V21a3 3 0 0 0-3-3H2z",
    "M22 4.5h-6a4 4 0 0 0-4 4V21a3 3 0 0 1 3-3h7z",
  ],
  search: [circle(11, 11, 6.5), "M16 16l4.5 4.5"],
  book: [
    "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z",
    "M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5",
  ],
} as const satisfies Record<string, readonly string[]>;

export type IconName = keyof typeof GLYPHS;

export function Icon(
  { name, size = 20 }: { name: IconName; size?: number },
): JSX.Element {
  return (
    <svg
      class="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {GLYPHS[name].map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}
