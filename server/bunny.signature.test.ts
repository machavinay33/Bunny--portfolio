import { describe, expect, it } from "vitest";
import { BUNNY_REPLAY_GAP_MS, BUNNY_SEQUENCE_MS } from "../client/src/components/BunnySignature";

describe("Bunny signature choreography", () => {
  it("keeps the requested sequence duration and 8-second replay gap", () => {
    expect(BUNNY_SEQUENCE_MS).toBe(3250);
    expect(BUNNY_REPLAY_GAP_MS).toBe(8000);
  });
});
