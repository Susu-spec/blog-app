export function extractMeta(blocks) {
    if (blocks === null) return null;
    console.log(blocks)

    const titleBlock = blocks?.find(b => b.type === "heading");
    const subtitleBlock = blocks?.find(b => b.type === "paragraph");

    return {
        title: titleBlock?.content?.[0]?.text || "Untitled",
        subtitle: subtitleBlock?.content?.[0]?.text || "No subtitle."
    };
}

export const levelMap = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

export const levelFontSize = {
  1: "3xl",
  2: "2xl",
  3: "xl",
  4: "lg",
  5: "md",
  6: "base",
}