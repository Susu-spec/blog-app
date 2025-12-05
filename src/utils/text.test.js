import { describe, expect, it } from "vitest";
import { levelMap, levelFontSize, slugify } from "./text";

describe("levelMap", () => {
  it("maps numbers 1-6 to correct heading tags", () => {
    expect(levelMap[1]).toBe("h1");
    expect(levelMap[3]).toBe("h3");
    expect(levelMap[6]).toBe("h6");
  });

  it("returns undefined for out-of-range values", () => {
    expect(levelMap[0]).toBeUndefined();
    expect(levelMap[7]).toBeUndefined();
  });
});

describe("levelFontSize", () => {
  it("maps numbers 1-6 to correct Tailwind font sizes", () => {
    expect(levelFontSize[1]).toBe("3xl");
    expect(levelFontSize[4]).toBe("lg");
    expect(levelFontSize[6]).toBe("base");
  });

  it("returns undefined for out-of-range values", () => {
    expect(levelFontSize[0]).toBeUndefined();
    expect(levelFontSize[7]).toBeUndefined();
  });
});

describe("slugify", () => {
  it("converts text to lowercase and replaces spaces with dashes", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes diacritics", () => {
    expect(slugify("Café")).toBe("cafe");
  });

  it("removes non-word characters", () => {
    expect(slugify("Hello!!! World???")).toBe("hello-world");
  });

  it("collapses multiple dashes", () => {
    expect(slugify("Hello   World")).toBe("hello-world");
    expect(slugify("Hello---World")).toBe("hello-world");
  });

  it("trims leading/trailing spaces", () => {
    expect(slugify("   Hello World   ")).toBe("hello-world");
  });
});
