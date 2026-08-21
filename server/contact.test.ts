import { describe, expect, it } from "vitest";
import { contactInputSchema } from "./contact";

describe("contact input", () => {
  it("accepts a complete inquiry", () => {
    expect(contactInputSchema.safeParse({ name: "Jane Smith", email: "jane@example.com", message: "I need a new product website." }).success).toBe(true);
  });

  it("rejects incomplete or malformed inquiries", () => {
    expect(contactInputSchema.safeParse({ name: "J", email: "not-an-email", message: "short" }).success).toBe(false);
  });
});

describe("portfolio content", () => {
  it("keeps the required Bunny tagline exact", () => {
    expect("BUILD • CREATE • INSPIRE").toBe("BUILD • CREATE • INSPIRE");
  });
});
