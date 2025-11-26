/**
 * Maps numeric heading levels to their corresponding HTML heading tags.
 *
 * @type {Object<number, string>}
 * @example
 * levelMap[1] // 'h1'
 * levelMap[3] // 'h3'
 */
export const levelMap = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

/**
 * Maps numeric heading levels to Tailwind CSS font size classes.
 *
 * @type {Object<number, string>}
 * @example
 * levelFontSize[1] // '3xl'
 * levelFontSize[4] // 'lg'
 */
export const levelFontSize = {
  1: "3xl",
  2: "2xl",
  3: "xl",
  4: "lg",
  5: "md",
  6: "base",
};


export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}
