import { describe, expect, it } from "vitest";
import { slugify } from "./text";

describe("slugify", () => {
  it("converts text to slug", () => {
    expect(slugify("Hello World!!")).toBe("hello-world");
  });

  it("handles accents", () => {
    expect(slugify("Café Été")).toBe("cafe-ete");
  });
});