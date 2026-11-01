// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mountApp, safeArtwork } from "../../App";
import { defaults } from "../settings/controller";
const mock = vi.hoisted(() => ({
  invoke: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  resolve: vi.fn(),
  volume: vi.fn(),
  events: new Map<string, (event: { payload: string }) => void>(),
}));
vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn(async (name, handler) => {
    mock.events.set(name, handler);
    return () => mock.events.delete(name);
  }),
}));
vi.mock("@tauri-apps/api/core", () => ({ invoke: mock.invoke }));
vi.mock("@tauri-apps/api/window", () => ({
  getCurrentWindow: () => ({ hide: vi.fn().mockResolvedValue(undefined) }),
}));
vi.mock("../player/transport", () => ({
  HtmlAudioTransport: class {
    start = mock.start;
    stop = mock.stop;
    setVolume = mock.volume;
  },
}));
vi.mock("../player/invoke", () => ({ resolveStream: mock.resolve }));
const stations = [
  ["mbc-mfm", "MBC FM4U"],
  ["sbs-powerpc", "SBS 파워FM"],
  ["tbn-gyeongin", "TBN 경인"],
  ["tbn-busan", "TBN 부산"],
].map(([id, name]) => ({
  id,
  name,
  providerId: id.split("-")[0],
  region: null,
  groupId: id.startsWith("tbn") ? "tbn" : null,
  streamKey: "x",
  officialPageUrl: "https://example.com",
}));
const tick = async () => {
  for (let i = 0; i < 25; i++) await Promise.resolve();
};
let root: HTMLElement,
  dispose: (() => void) | undefined,
  saved = defaults();
beforeEach(() => {
  vi.clearAllMocks();
  mock.events.clear();
  saved = {
    ...defaults(),
    onboardingCompleted: true,
    lastStationId: "mbc-mfm",
  };
  root = document.createElement("div");
  document.body.append(root);
  mock.invoke.mockImplementation(async (command, args) => {
    if (command === "load_settings") return { ok: true, data: saved };
    if (command === "save_settings") {
      saved = args.settings;
      return { ok: true, data: saved };
    }
    if (command === "list_stations")
      return { ok: true, data: { version: 1, stations } };
    if (command === "get_programs")
      return {
        ok: true,
        data: stations.map((s) => ({
          stationId: s.id,
          status: "available",
          sourceKind: "schedule",
          title: "현재 방송 <script>",
          startsAt: new Date(Date.now() - 3600000).toISOString(),
          endsAt: new Date(Date.now() + 3600000).toISOString(),
          fetchedAt: new Date().toISOString(),
          sourceUrl: "https://example.com",
        })),
      };
    if (command === "get_schedule")
      return {
        ok: true,
        data: {
          stationId: args.stationId,
          entries: [
            {
              title: "다음 프로그램",
              startsAt: new Date(Date.now() + 3600000).toISOString(),
              endsAt: new Date(Date.now() + 7200000).toISOString(),
            },
          ],
          fetchedAt: new Date().toISOString(),
        },
      };
    return { ok: true, data: { enabled: true } };
  });
  mock.resolve.mockImplementation(async (id) => ({
    ok: true,
    data: {
      stationId: id,
      url: "https://example.com/live",
      format: "mp3",
      resolvedAt: "",
    },
  }));
  mock.start.mockImplementation((_s, e) => e.playing());
});
afterEach(() => {
  dispose?.();
  root.remove();
});
function click(label: string) {
  const b = [...root.querySelectorAll<HTMLButtonElement>("button")].find(
    (b) => b.getAttribute("aria-label") === label,
  );
  expect(b, label).toBeTruthy();
  b!.click();
}
it("restores silently, shows only Gyeongin and safely renders remote text", async () => {
  dispose = await mountApp(root);
  await tick();
  expect(mock.resolve).not.toHaveBeenCalled();
  expect(root.querySelectorAll(".station")).toHaveLength(3);
  expect(root.textContent).not.toContain("TBN 부산");
  expect(root.querySelector("script")).toBeNull();
  expect(root.textContent).toContain("현재 방송 <script>");
  expect(root.querySelector("input[type=range]")).toBeNull();
});
it("keeps playback through settings, schedule and channel-list transitions", async () => {
  dispose = await mountApp(root);
  await tick();
  click("방송 재생");
  await tick();
  const stops = mock.stop.mock.calls.length;
  click("MBC FM4U 편성표");
  await tick();
  expect(root.querySelector("main")?.textContent).toContain("다음 프로그램");
  click("돌아가기");
  click("채널 목록 표시 전환");
  await tick();
  expect(root.querySelector(".shell.channels-collapsed")).toBeTruthy();
  expect(saved.playerMode).toBe("mini");
  expect(
    root.querySelector(".channel-visibility")?.getAttribute("aria-expanded"),
  ).toBe("false");
  expect(root.querySelector(".shell")?.lastElementChild).toBe(
    root.querySelector(".channel-visibility"),
  );
  expect(root.querySelector('button[aria-label="미니 플레이어"]')).toBeNull();
  expect(mock.invoke).toHaveBeenCalledWith(
    "set_player_size",
    expect.objectContaining({ mini: true }),
  );
  click("설정");
  await tick();
  expect(mock.invoke).toHaveBeenCalledWith(
    "set_player_size",
    expect.objectContaining({ mini: false }),
  );
  click("돌아가기");
  await tick();
  expect(root.querySelector(".shell.channels-collapsed")).toBeTruthy();
  click("채널 목록 표시 전환");
  await tick();
  expect(root.querySelector(".channel-visibility")?.textContent).toContain("채널 닫기");
  expect(root.querySelector(".channel-visibility")?.previousElementSibling).toBe(root.querySelector("main"));
  expect(root.querySelector(".shell.channels-collapsed")).toBeNull();
  expect(mock.stop).toHaveBeenCalledTimes(stops);
});
it("keeps volume DOM and focus through saves and metadata refresh; remembers appearance", async () => {
  dispose = await mountApp(root);
  await tick();
  click("설정");
  await tick();
  const volume = root.querySelector<HTMLInputElement>("input[type=range]")!;
  volume.focus();
  volume.value = "23";
  volume.dispatchEvent(new Event("input"));
  await tick();
  window.dispatchEvent(new Event("focus"));
  await tick();
  expect(root.querySelector("input[type=range]")).toBe(volume);
  expect(document.activeElement).toBe(volume);
  expect(saved.volume).toBe(23);
  click("다크 모드");
  await tick();
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(saved.appearance).toBe("dark");
  click("음소거");
  await tick();
  expect(saved.volume).toBe(0);
  click("음소거");
  await tick();
  expect(saved.volume).toBe(23);
});
it("disables only stepping, allows direct playback and removes favorites", async () => {
  dispose = await mountApp(root);
  await tick();
  expect(root.textContent).not.toContain("즐겨찾기");
  click("채널 편집");
  root.querySelector<HTMLInputElement>('[aria-label="SBS 파워FM 넘길 때 포함"]')!.click();
  await tick();
  expect(saved.disabledChannelIds).toEqual(["sbs-powerpc"]);
  expect(
    root.querySelector('[data-key="next-channel"]')?.getAttribute("aria-label"),
  ).toContain("TBN 경인");
  click("SBS 파워FM 재생");
  await tick();
  expect(mock.resolve).toHaveBeenCalledWith("sbs-powerpc", expect.anything());
});
it("reorders using keyboard without playing and persists the new order", async () => {
  dispose = await mountApp(root);
  await tick();
  click("채널 편집");
  root
    .querySelector('[data-key="reorder-mbc-mfm"]')!
    .dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
    );
  await tick();
  expect(saved.channelOrder).toEqual([
    "sbs-powerpc",
    "mbc-mfm",
    "tbn-gyeongin",
  ]);
  expect(
    [...root.querySelectorAll<HTMLElement>(".station")].map(
      (el) => el.dataset.stationId,
    ),
  ).toEqual(saved.channelOrder);
  expect(mock.start).not.toHaveBeenCalled();
});
it("does not let a late schedule response switch channel or reopen a panel", async () => {
  dispose = await mountApp(root);
  await tick();
  const original = mock.invoke.getMockImplementation()!;
  let resolve: any;
  mock.invoke.mockImplementation((c, a) =>
    c === "get_schedule" ? new Promise((r) => (resolve = r)) : original(c, a),
  );
  click("SBS 파워FM 편성표");
  click("돌아가기");
  click("방송 재생");
  await tick();
  click("방송 정지");
  resolve({
    ok: true,
    data: { stationId: "sbs-powerpc", entries: [], fetchedAt: "" },
  });
  await tick();
  expect(root.querySelector("main")?.getAttribute("aria-label")).toBe(
    "방송 목록",
  );
  expect(root.querySelector('[aria-label="방송 재생"]')).toBeTruthy();
  expect(root.querySelector("footer")?.textContent).not.toContain("정지됨");
  expect(mock.resolve).toHaveBeenCalledTimes(1);
});
it("refreshes OS registration and shows failed saves without replacing slider", async () => {
  dispose = await mountApp(root);
  await tick();
  click("설정");
  await tick();
  const original = mock.invoke.getMockImplementation()!;
  mock.invoke.mockImplementation((c, a) =>
    c === "get_autostart"
      ? Promise.resolve({ ok: true, data: { enabled: false } })
      : c === "save_settings"
        ? Promise.resolve({ ok: false, error: { message: "저장 실패" } })
        : original(c, a),
  );
  window.dispatchEvent(new Event("focus"));
  await tick();
  expect(
    root.querySelector<HTMLInputElement>("input[type=checkbox]")!.checked,
  ).toBe(false);
  click("다크 모드");
  await tick();
  expect(root.textContent).toContain("저장 실패");
});
it("shows fallback and retains audio when schedule is unavailable", async () => {
  const original = mock.invoke.getMockImplementation()!;
  mock.invoke.mockImplementation((c, a) =>
    c === "get_schedule" ? Promise.reject(new Error()) : original(c, a),
  );
  dispose = await mountApp(root);
  await tick();
  click("방송 재생");
  await tick();
  const stops = mock.stop.mock.calls.length;
  click("TBN 경인 편성표");
  await tick();
  expect(root.textContent).toContain("편성 정보가 없습니다");
  expect(root.querySelector('[aria-label="공식 편성표 확인"]')).toBeTruthy();
  expect(mock.stop).toHaveBeenCalledTimes(stops);
});
it("rejects foreign artwork, credentials and deceptive host names", () => {
  for (const url of [
    "http://img.imbc.com/a",
    "https://img.imbc.com.evil.test/a",
    "https://user@img.imbc.com/a",
    "javascript:alert(1)",
  ])
    expect(safeArtwork(url)).toBeNull();
  expect(safeArtwork("https://img.imbc.com/a.jpg")).toBeTruthy();
});

it("pins without changing playback and publishes actual tray playback state", async () => {
  dispose = await mountApp(root);
  await tick();
  expect(mock.invoke).toHaveBeenCalledWith(
    "set_tray_state",
    expect.objectContaining({ playing: false }),
  );
  expect(root.querySelector('[aria-label="창 숨기기"]')).toBeNull();
  click("플레이어 고정");
  await tick();
  expect(mock.invoke).toHaveBeenCalledWith("set_player_pinned", {
    pinned: true,
  });
  expect(
    root.querySelector('[data-key="pin"]')?.getAttribute("aria-pressed"),
  ).toBe("true");
  click("방송 재생");
  await tick();
  expect(mock.invoke).toHaveBeenCalledWith(
    "set_tray_state",
    expect.objectContaining({ playing: true }),
  );
  click("방송 정지");
  await tick();
  expect(
    mock.invoke.mock.calls.filter((c) => c[0] === "set_tray_state").at(-1)?.[1],
  ).toEqual(expect.objectContaining({ playing: false }));
  click("플레이어 고정 해제");
  await tick();
  expect(root.querySelector("header")?.classList.contains("draggable")).toBe(
    false,
  );
});
it("shows past, current and next schedules by date without hiding past programs", async () => {
  const original = mock.invoke.getMockImplementation()!;
  const now = Date.now();
  mock.invoke.mockImplementation((c, a) =>
    c === "get_schedule"
      ? Promise.resolve({
          ok: true,
          data: {
            stationId: a.stationId,
            fetchedAt: new Date(now).toISOString(),
            entries: [
              {
                title: "지난 프로그램",
                startsAt: new Date(now - 7200000).toISOString(),
                endsAt: new Date(now - 3600000).toISOString(),
              },
              {
                title: "현재 프로그램",
                startsAt: new Date(now - 3600000).toISOString(),
                endsAt: new Date(now + 3600000).toISOString(),
              },
              {
                title: "다음 프로그램",
                startsAt: new Date(now + 3600000).toISOString(),
                endsAt: new Date(now + 7200000).toISOString(),
              },
            ],
          },
        })
      : original(c, a),
  );
  dispose = await mountApp(root);
  await tick();
  expect(root.querySelector(".next-program")?.textContent).toContain(
    "다음 프로그램",
  );
  expect(root.querySelector(".program-time")?.textContent).not.toContain(
    "편성표 기준",
  );
  click("현재 채널 편성표");
  await tick();
  expect(root.querySelector(".schedule-row.past")?.textContent).toContain(
    "지난 프로그램",
  );
  expect(root.querySelector(".schedule-row.current")?.textContent).toContain(
    "현재 프로그램",
  );
  expect(root.querySelector('[aria-label="편성표 날짜"]')).toBeTruthy();
});
it("preserves saved volume and removes redundant settings copy", async () => {
  saved.volume = 0;
  dispose = await mountApp(root);
  await tick();
  click("설정");
  await tick();
  expect(root.querySelector<HTMLInputElement>("input[type=range]")?.value).toBe(
    "0",
  );
  expect(root.querySelector(".settings")?.textContent).not.toContain("내 취향대로");
  expect(root.textContent).not.toContain("OS 등록 상태");
});

it("shows neighboring channel names and switches through the single player", async () => {
  dispose = await mountApp(root);
  await tick();
  const hero = root.querySelector("footer")!;
  expect(hero.querySelector(".current-station")?.textContent).toContain(
    "MBC FM4U ·",
  );
  expect(hero.querySelector(".play-status")).toBeNull();
  click("다음 채널: SBS 파워FM");
  await tick();
  expect(mock.resolve).toHaveBeenLastCalledWith(
    "sbs-powerpc",
    expect.any(AbortSignal),
  );
  expect(hero.querySelector(".current-station")?.textContent).toContain(
    "SBS 파워FM",
  );
  click("이전 채널: MBC FM4U");
  await tick();
  expect(hero.querySelector(".current-station")?.textContent).toContain(
    "MBC FM4U",
  );
  click("이전 채널: TBN 경인");
  await tick();
  expect(hero.querySelector(".current-station")?.textContent).toContain(
    "TBN 경인",
  );
  click("다음 채널: MBC FM4U");
  await tick();
  expect(hero.querySelector(".current-station")?.textContent).toContain(
    "MBC FM4U",
  );
});

it("shows transparency only while pinned, preserves the slider during playback updates, and resets on unpin", async () => {
  dispose = await mountApp(root);
  await tick();
  expect(root.querySelector('[aria-label="플레이어 투명도"]')).toBeNull();
  click("플레이어 고정");
  await tick();
  const slider = root.querySelector<HTMLInputElement>(
    '[aria-label="플레이어 투명도"]',
  )!;
  expect(slider.value).toBe("60");
  expect(slider.getAttribute("aria-valuetext")).toBe("투명도 0%");
  slider.focus();
  slider.value = "35";
  slider.dispatchEvent(new Event("input"));
  await tick();
  expect(mock.invoke).toHaveBeenCalledWith("set_player_opacity", {
    percent: 75,
  });
  click("방송 재생");
  await tick();
  expect(root.querySelector('[aria-label="플레이어 투명도"]')).toBe(slider);
  expect(slider.value).toBe("35");
  for (const [position, percent, label] of [
    [0, 40, "투명도 60%"],
    [60, 100, "투명도 0%"],
  ] as const) {
    slider.value = String(position);
    slider.dispatchEvent(new Event("input"));
    await tick();
    expect(mock.invoke).toHaveBeenLastCalledWith("set_player_opacity", {
      percent,
    });
    expect(slider.getAttribute("aria-valuetext")).toBe(label);
  }
  click("플레이어 고정 해제");
  await tick();
  expect(mock.invoke).toHaveBeenCalledWith("set_player_opacity", {
    percent: 100,
  });
  expect(root.querySelector('[aria-label="플레이어 투명도"]')).toBeNull();
});

it("routes tray actions to the same player and opens settings without starting audio", async () => {
  dispose = await mountApp(root);
  await tick();
  expect(mock.invoke).toHaveBeenCalledWith(
    "set_tray_state",
    expect.objectContaining({
      station: "MBC FM4U",
      program: "현재 방송 <script>",
      busy: false,
    }),
  );
  const event = mock.events.get("tray-action")!;
  event({ payload: "settings" });
  await tick();
  expect(root.querySelector(".settings")).not.toBeNull();
  expect(mock.start).not.toHaveBeenCalled();
  event({ payload: "playback" });
  await tick();
  expect(mock.start).toHaveBeenCalledTimes(1);
  expect(mock.invoke).toHaveBeenCalledWith(
    "set_tray_state",
    expect.objectContaining({ busy: true, playing: true }),
  );
  event({ payload: "playback" });
  await tick();
  expect(mock.invoke).toHaveBeenCalledWith(
    "set_tray_state",
    expect.objectContaining({ busy: false, playing: false }),
  );
  event({ payload: "open" });
  await tick();
  expect(root.querySelector(".settings")).toBeNull();
  dispose();
  dispose = undefined;
  expect(mock.events.has("tray-action")).toBe(false);
});

it("accepts only official HTTPS KBS artwork hosts", () => {
  expect(safeArtwork("https://programres.kbs.co.kr/a.jpg")).toBeTruthy();
  expect(
    safeArtwork("https://mediafactory.play.kbs.co.kr/a.jpeg"),
  ).toBeTruthy();
  expect(
    safeArtwork("https://programres.kbs.co.kr.evil.test/a.jpg"),
  ).toBeNull();
  expect(safeArtwork("https://user@programres.kbs.co.kr/a.jpg")).toBeNull();
});

it("CBS artwork allows only the official HTTPS host", () => {
  expect(
    safeArtwork("https://cbs.co.kr/data/cbs/upload/save/program/a.png"),
  ).toBeTruthy();
  expect(safeArtwork("https://cbs.co.kr.evil.test/a.png")).toBeNull();
  expect(safeArtwork("http://cbs.co.kr/a.png")).toBeNull();
});

it("first-run introduction is optional, persists dismissal, and never starts audio", async () => {
  saved = { ...defaults(), lastStationId: "mbc-mfm" };
  dispose = await mountApp(root);
  const intro = root.querySelector<HTMLElement>(".welcome")!;
  expect(intro.hidden).toBe(false);
  expect(root.querySelector<HTMLInputElement>(".welcome input")!.checked).toBe(
    false,
  );
  root.querySelector<HTMLButtonElement>(".welcome-start")!.click();
  await tick();
  expect(saved.onboardingCompleted).toBe(true);
  expect(saved.analyticsEnabled).toBe(false);
  expect(intro.hidden).toBe(true);
  expect(mock.start).not.toHaveBeenCalled();
  dispose();
  dispose = await mountApp(root);
  expect(root.querySelector<HTMLElement>(".welcome")!.hidden).toBe(true);
});

it("failed onboarding save keeps the introduction and reports the error", async () => {
  saved = { ...defaults() };
  dispose = await mountApp(root);
  const previous = mock.invoke.getMockImplementation()!;
  mock.invoke.mockImplementation(async (cmd, args) =>
    cmd === "save_settings"
      ? {
          ok: false,
          error: { code: "storage", message: "저장 실패", retryable: true },
        }
      : previous(cmd, args),
  );
  root.querySelector<HTMLButtonElement>(".welcome-start")!.click();
  await tick();
  expect(root.querySelector<HTMLElement>(".welcome")!.hidden).toBe(false);
  expect(root.querySelector(".welcome .error")!.textContent).toBe("저장 실패");
  expect(saved.onboardingCompleted).toBe(false);
});

it("mini mode reuses controls and preserves playback and list state", async () => {
  dispose = await mountApp(root);
  await tick();
  click("방송 재생");
  await tick();
  const play = root.querySelector(".play-button");
  const stops = mock.stop.mock.calls.length;
  click("미니모드로 전환");
  await tick();
  expect(root.querySelector(".mini-player")).toBeTruthy();
  expect(root.querySelector(".mini-controls .play-button")).toBe(play);
  expect(root.querySelectorAll(".mini-controls button")).toHaveLength(3);
  expect(mock.invoke).toHaveBeenCalledWith(
    "set_player_size",
    expect.objectContaining({ miniPlayer: true, height: 98 }),
  );
  expect(mock.stop).toHaveBeenCalledTimes(stops);
  click("일반 화면으로");
  await tick();
  expect(root.querySelector(".hero-bottom .play-button")).toBe(play);
  expect(root.querySelector(".mini-player")).toBeNull();
  expect(
    root.querySelector(".channel-visibility")?.getAttribute("aria-expanded"),
  ).toBe("true");
  expect(mock.stop).toHaveBeenCalledTimes(stops);
});

it("keeps transparency available in pinned mini mode and retains its value across modes", async () => {
  dispose = await mountApp(root);
  await tick();
  click("미니모드로 전환");
  await tick();
  expect(root.querySelector('[aria-label="플레이어 투명도"]')).toBeNull();
  click("플레이어 고정");
  await tick();
  const slider = root.querySelector<HTMLInputElement>(
    '[aria-label="플레이어 투명도"]',
  )!;
  expect(slider).not.toBeNull();
  slider.value = "20";
  slider.dispatchEvent(new Event("input"));
  await tick();
  expect(mock.invoke).toHaveBeenCalledWith("set_player_opacity", {
    percent: 60,
  });
  click("일반 화면으로");
  await tick();
  expect(
    root.querySelector<HTMLInputElement>('[aria-label="플레이어 투명도"]')!
      .value,
  ).toBe("20");
  click("미니모드로 전환");
  await tick();
  expect(
    root.querySelector<HTMLInputElement>('[aria-label="플레이어 투명도"]')!
      .value,
  ).toBe("20");
  click("플레이어 고정 해제");
  await tick();
  expect(root.querySelector('[aria-label="플레이어 투명도"]')).toBeNull();
  expect(mock.invoke).toHaveBeenCalledWith("set_player_opacity", {
    percent: 100,
  });
});

it("persists pointer drop and cancels abandoned drags without playback", async () => {
  dispose = await mountApp(root);
  await tick();
  click("채널 편집");
  const drag = (cancel: boolean) => {
    const handle = root.querySelector<HTMLElement>(
      '[data-key="reorder-mbc-mfm"]',
    )!;
    handle.setPointerCapture = vi.fn();
    handle.hasPointerCapture = () => false;
    handle.releasePointerCapture = vi.fn();
    document.elementFromPoint = () =>
      root.querySelector('[data-station-id="tbn-gyeongin"]');
    handle.dispatchEvent(
      new MouseEvent("pointerdown", { button: 0, bubbles: true }),
    );
    handle.dispatchEvent(
      new MouseEvent("pointermove", {
        clientX: 10,
        clientY: 100,
        bubbles: true,
      }),
    );
    handle.dispatchEvent(
      new MouseEvent(cancel ? "pointercancel" : "pointerup", { bubbles: true }),
    );
  };
  drag(true);
  await tick();
  expect(saved.channelOrder).toEqual([]);
  drag(false);
  await tick();
  expect(saved.channelOrder).toEqual([
    "sbs-powerpc",
    "tbn-gyeongin",
    "mbc-mfm",
  ]);
  expect(mock.start).not.toHaveBeenCalled();
});

it("shows editing controls only in edit mode and keeps excluded channels readable", async () => {
  saved.disabledChannelIds = ["sbs-powerpc"];
  dispose = await mountApp(root);
  await tick();
  expect(root.querySelector(".channel-drag")).toBeNull();
  expect(root.querySelector(".channel-include")).toBeNull();
  expect(root.querySelector(".channel-skip-badge")?.textContent).toBe("넘기기 제외");
  click("채널 편집");
  expect(root.querySelectorAll(".channel-include")).toHaveLength(3);
  expect(root.querySelector(".schedule-button")).toBeNull();
  click("채널 편집 완료");
  expect(root.querySelector(".channel-include")).toBeNull();
  expect(mock.start).not.toHaveBeenCalled();
});
it("offers editing when every channel is excluded", async () => {
  saved.disabledChannelIds = stations.map((s) => s.id);
  dispose = await mountApp(root);
  await tick();
  expect(root.querySelector<HTMLButtonElement>('[data-key="next-channel"]')?.disabled).toBe(true);
  click("넘길 채널 선택하기");
  expect(root.querySelectorAll(".channel-include")).toHaveLength(3);
});
