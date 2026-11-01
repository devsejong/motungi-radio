import { describe, it, expect, vi, afterEach } from "vitest";
import { stations, resolve, validate } from "./streams";
afterEach(() => vi.unstubAllGlobals());
describe("browser stream boundaries", () => {
  it("only includes Gyeongin and rejects untrusted destinations", () => {
    expect(
      stations.filter((s) => s.providerId === "tbn").map((s) => s.id),
    ).toEqual(["tbn-gyeongin"]);
    for (const url of [
      "http://m-aac.cbs.co.kr/a",
      "https://m-aac.cbs.co.kr.evil.test/a",
      "https://user@m-aac.cbs.co.kr/a",
      "https://m-aac.cbs.co.kr:444/a",
    ])
      expect(() => validate(url, "cbs")).toThrow();
  });
  it("does not fetch unsupported stations", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    expect((await resolve("mbc-mfm", new AbortController().signal)).ok).toBe(
      false,
    );
    expect(fetch).not.toHaveBeenCalled();
  });
  it("does not return malicious URLs from official APIs", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            JSON.stringify({
              channel_item: [{ service_url: "https://evil.test/live.m3u8" }],
            }),
          ),
        ),
    );
    expect((await resolve("kbs-21", new AbortController().signal)).ok).toBe(
      false,
    );
  });
  it("resolves official URLs in memory only", async () => {
    const r = await resolve("cbs-music", new AbortController().signal);
    expect(r.ok).toBe(true);
    if (r.ok) expect(new URL(r.data.url).hostname).toBe("m-aac.cbs.co.kr");
  });
});
