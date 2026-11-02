/**
 * Where to crop program photos that lose faces in the wide program cards.
 * Keyed by image URL, so it follows the photo whichever program uses it.
 * Photos not listed keep each card's default crop.
 */
const IMAGE_FOCUS: Record<string, string> = {
  "/images/programs/practical-nursing.jpg": "center 15%",
  "/images/programs/nurse-aide-i.jpg": "center 15%",
  "/images/programs/aha-cpr-instructor.png": "center 30%",
};

/** Inline style that applies a photo's crop, or nothing for unlisted photos. */
export function imageFocusStyle(src: string): { objectPosition: string } | undefined {
  const focus = IMAGE_FOCUS[src];
  return focus ? { objectPosition: focus } : undefined;
}
