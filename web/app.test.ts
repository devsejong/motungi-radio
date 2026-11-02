// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
const calls = vi.hoisted(() => ({ stop: vi.fn(), start: vi.fn() }));
vi.mock("./streams", async () => ({
  ...(await vi.importActual<typeof import("./streams")>("./streams")),
  resolve: async (stationId: string) => ({
    ok: true,
    data: {
      stationId,
      url: "https://example.invalid/test.m3u8",
      format: "hls",
    },
  }),
}));
vi.mock("../src/features/player/transport", () => ({
  HtmlAudioTransport: class {
    setVolume() {}
    stop() {
      calls.stop();
    }
    start(_stream: unknown, events: { playing(): void }) {
      calls.start();
      events.playing();
    }
  },
}));
vi.mock("./programs", () => ({ watchPrograms: () => () => {} }));
it("mounts radio, keeps its DOM while switching routes, and exposes controllable banner", async () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
  }));
  document.body.innerHTML = '<main id="app"></main>';
  await import("./main");
  const radio = document.querySelector(".player");
  expect(radio).not.toBeNull();
  (document.querySelector(".play") as HTMLButtonElement).click();
  await vi.waitFor(() => expect(calls.start).toHaveBeenCalledOnce());
  expect(document.querySelectorAll(".playing-dot.playing i")).toHaveLength(3);
  const stops = calls.stop.mock.calls.length;
  const nav = [...document.querySelectorAll<HTMLAnchorElement>(".site-tabs a")];
  nav[1].click();
  expect(document.querySelector(".download-view")?.hasAttribute("hidden")).toBe(
    false,
  );
  expect(document.querySelector(".workspace")?.hasAttribute("hidden")).toBe(
    true,
  );
  nav[0].click();
  expect(document.querySelector(".player")).toBe(radio);
  expect(document.querySelector(".workspace")?.hasAttribute("hidden")).toBe(
    false,
  );
  expect(calls.stop).toHaveBeenCalledTimes(stops);
  expect(calls.start).toHaveBeenCalledOnce();
  (document.querySelectorAll(".banner-dot")[1] as HTMLButtonElement).click();
  expect(
    document.querySelector(".download-banner-copy strong")?.textContent,
  ).toContain("집중");
  window.dispatchEvent(new Event("pagehide"));
  vi.unstubAllGlobals();
});
