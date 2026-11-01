import { Analytics } from "./features/analytics/controller";
import {
  isAppStore,
  distributionName,
  supportsAutostart,
} from "./shared/distribution";
import appMetadata from "../src-tauri/tauri.conf.json";
import { UpdateController } from "./features/updates/controller";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import type {
  Catalog,
  ProgramState,
  Result,
  Schedule,
  Station,
} from "./shared/contracts";
import { PlayerController } from "./features/player/controller";
import { HtmlAudioTransport } from "./features/player/transport";
import { resolveStream } from "./features/player/invoke";
import { bindPlaybackLifecycle } from "./features/player/lifecycle";
import {
  AutostartController,
  SettingsController,
} from "./features/settings/controller";
import {
  ProgramPoller,
  currentProgram,
  unavailable,
} from "./features/programs";
import { flowingTitle } from "./features/programs/marquee";
import {
  channelNeighbors,
  moveChannel,
  channelRows,
} from "./features/channels/model";
function node<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
  className?: string,
) {
  const e = document.createElement(tag);
  if (text) e.textContent = text;
  if (className) e.className = className;
  return e;
}
function button(text: string, label: string, action: () => void, key = label) {
  const b = node("button", text);
  b.type = "button";
  b.setAttribute("aria-label", label);
  b.dataset.key = key;
  b.onclick = action;
  return b;
}
const time = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const dayFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const dayKey = (value: string | number) => dayFormat.format(new Date(value));
const dateLabel = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  month: "numeric",
  day: "numeric",
});
export function safeArtwork(raw?: string | null) {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    return u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !u.hash &&
      raw.length < 2048 &&
      (!u.port || u.port === "443") &&
      [
        "img.imbc.com",
        "img.cpbc.co.kr",
        "seoul.febc.net",
        "m.bbsi.co.kr",
        "wbsi.kr",
        "static.ebs.co.kr",
        "cbs.co.kr",
        "image.cloud.sbs.co.kr",
        "programres.kbs.co.kr",
        "mediafactory.play.kbs.co.kr",
      ].includes(u.hostname)
      ? u.href
      : null;
  } catch {
    return null;
  }
}
export async function mountApp(root: HTMLElement) {
  let stations: Catalog["stations"] = [],
    programs = new Map<string, ProgramState>(),
    ready = false,
    disposed = false,
    channelDragging = false;
  let panel: "channels" | "settings" | "schedule" = "channels",
    scheduleId: string | null = null;
  let miniPlayer = false;
  let editingChannels = false;
  let channelsVisible = true,
    catalogError = "",
    infoError = "",
    actionError = "",
    lastVolume = 100;
  let pinned = false,
    pinBusy = false,
    transparency = 0,
    scheduleDate = "",
    scheduleFocusPending = false;
  const schedules = new Map<string, Schedule>(),
    pending = new Set<string>();
  const analytics = new Analytics();
  const updater = new UpdateController(() => render());
  const settings = new SettingsController(undefined, () => {
    analytics.setEnabled(settings.settings.analyticsEnabled === true);
    render();
  });
  const autostart = new AutostartController(undefined, () => render());
  const player = new PlayerController({
    transport: new HtmlAudioTransport(),
    resolve: resolveStream,
    persist: (patch) => {
      void settings.update((s) => ({ ...s, ...patch }));
    },
  });
  const lifecycle = bindPlaybackLifecycle(player);
  const shell = node("div", undefined, "shell"),
    header = node("header"),
    main = node("main"),
    hero = node("footer", undefined, "now-playing");
  const cover = node("div", undefined, "cover"),
    heroText = node("div", undefined, "hero-copy"),
    title = node("strong", undefined, "current-title"),
    stationName = node("span", undefined, "current-station"),
    stationLabel = node("span", undefined, "station-label"),
    airtime = node("span", undefined, "program-time"),
    error = node("p", undefined, "error");
  const titleFlow = flowingTitle(title);
  stationName.append(
    stationLabel,
    node("span", " · ", "program-separator"),
    airtime,
  );
  const control = button(
    "재생",
    "방송 재생",
    () => {
      if (["playing", "loading"].includes(player.state.status)) player.stop();
      else void player.play();
    },
    "play",
  );
  control.className = "play-button";
  const next = button(
    "다음 방송 확인",
    "현재 채널 편성표",
    () => {
      if (player.state.stationId) openSchedule(player.state.stationId);
    },
    "current-schedule",
  );
  next.className = "next-program";
  const heroTop = node("div", undefined, "hero-top"),
    heroBottom = node("div", undefined, "hero-bottom");
  const previousChannelName = node("span", undefined, "neighbor-name"),
    nextChannelName = node("span", undefined, "neighbor-name");
  const neighbors = () =>
    channelNeighbors(stations, settings.settings, player.state.stationId);
  const previousChannel = button(
    "",
    "이전 채널",
    () => {
      const station = neighbors().previous;
      if (station) {
        analytics.capture("channel_changed", { method: "previous" });
        animateDial(-1);
        void player.select(station.id);
      }
    },
    "previous-channel",
  );
  const nextChannel = button(
    "",
    "다음 채널",
    () => {
      const station = neighbors().next;
      if (station) {
        analytics.capture("channel_changed", { method: "next" });
        animateDial(1);
        void player.select(station.id);
      }
    },
    "next-channel",
  );
  const glyph = (path: string) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    const shape = document.createElementNS(svg.namespaceURI, "path");
    shape.setAttribute("d", path);
    svg.append(shape);
    return svg;
  };
  previousChannel.className = nextChannel.className = "channel-step";
  previousChannel.append(glyph("M15 6l-6 6 6 6"), previousChannelName);
  nextChannel.append(nextChannelName, glyph("M9 6l6 6-6 6"));
  const tunedName = node("strong", undefined, "tuned-name");
  const tuned = node("div", undefined, "tuned-channel");
  tuned.setAttribute("aria-label", "현재 채널");
  tuned.append(tunedName);
  const dialLabels = node("div", undefined, "dial-labels");
  dialLabels.append(previousChannel, tuned, nextChannel);
  const ruler = node("div", undefined, "tuner-ruler");
  ruler.setAttribute("aria-hidden", "true");
  const ticks = node("div", undefined, "tuner-ticks");
  let dialAnimation: Animation | undefined;
  const animateDial = (direction: number) => {
    // Continue from the visible position, including rapid consecutive clicks.
    const current =
      parseFloat(getComputedStyle(ticks).backgroundPositionX) || 0;
    dialAnimation?.cancel();
    const start = ((current % 80) + 80) % 80;
    const end = start + direction * (32 + Math.random() * 32);
    // Keep the new phase after animation; both tick layers repeat every 80px.
    ticks.style.backgroundPositionX = `${((end % 80) + 80) % 80}px`;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches)
      return;
    dialAnimation = ticks.animate?.(
      [
        { backgroundPositionX: `${start}px` },
        { backgroundPositionX: `${end}px` },
      ],
      { duration: 360, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  };
  ruler.append(ticks, node("div", undefined, "tuner-needle"));
  const dial = node("div", undefined, "tuner-dial");
  dial.append(dialLabels, ruler);
  heroText.append(stationName, title, next);
  heroTop.append(cover, heroText);
  heroBottom.append(dial, control);
  error.setAttribute("role", "alert");
  hero.append(heroTop, heroBottom, error);
  hero.setAttribute("aria-label", "현재 프로그램");
  const volumeBox = node("section", undefined, "volume-setting"),
    volumeLabel = node("label", "음량"),
    volume = node("input"),
    volumeValue = node("output");
  volume.type = "range";
  volume.min = "0";
  volume.max = "100";
  volume.id = "app-volume";
  volume.dataset.key = "volume";
  volume.setAttribute("aria-label", "음량");
  volumeLabel.htmlFor = volume.id;
  volume.oninput = () => {
    volumeValue.textContent = `${volume.value}%`;
    player.setVolume(Number(volume.value));
  };
  const mute = button(
    "음소거",
    "음소거",
    () => {
      const v = Number(volume.value);
      if (v > 0) lastVolume = v;
      volume.value = String(v > 0 ? 0 : lastVolume || 100);
      volume.dispatchEvent(new Event("input"));
    },
    "mute",
  );
  const volumeHeading = node("div", undefined, "setting-heading"),
    volumeControls = node("div", undefined, "volume-controls");
  volumeHeading.append(volumeLabel, volumeValue);
  volumeControls.append(node("span", "◖))", "speaker"), volume, mute);
  volumeBox.append(volumeHeading, volumeControls);
  const updateNotice = button(
    "새 버전 설치 준비 완료 · 설정에서 업데이트",
    "업데이트 알림",
    () => {
      panel = "settings";
      render();
    },
  );
  updateNotice.className = "update-notice";
  hero.append(updateNotice);
  const channelToggle = button(
    "채널 숨기기",
    "채널 목록 표시 전환",
    () => {
      channelsVisible = !channelsVisible;
      // Preserve the existing settings contract; this now only controls the list.
      const playerMode = channelsVisible ? "full" : "mini";
      void settings.update((value) => ({ ...value, playerMode }));
      render();
    },
    "channel-visibility",
  );
  channelToggle.className = "channel-visibility";
  const channelToggleLabel = node("span");
  const channelChevron = glyph("m8 10 4 4 4-4");
  channelChevron.classList.add("channel-chevron");
  channelToggle.replaceChildren(
    glyph("M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"),
    channelToggleLabel,
    channelChevron,
  );
  channelToggle.setAttribute("aria-controls", "channel-panel");
  main.id = "channel-panel";
  shell.append(header, hero, main, channelToggle);
  const welcome = node("section", undefined, "welcome");
  welcome.setAttribute("aria-label", "모퉁이 라디오 시작 안내");
  welcome.hidden = true;
  const intro = node("h1", "모퉁이 라디오");
  const optLabel = node("label", undefined, "welcome-consent");
  const opt = node("input");
  opt.type = "checkbox";
  opt.disabled = !analytics.configured;
  optLabel.append(opt, node("span", "익명 사용 통계 보내기 (선택)"));
  const welcomeError = node("p", undefined, "error");
  welcomeError.setAttribute("role", "alert");
  let welcomeBusy = false,
    welcomeInitialized = false;
  const begin = button("라디오 시작하기", "라디오 시작하기", () => {
    if (welcomeBusy) return;
    welcomeBusy = true;
    begin.disabled = true;
    void settings
      .update((s) => ({
        ...s,
        onboardingCompleted: true,
        analyticsEnabled: opt.checked,
      }))
      .then(() => {
        welcomeBusy = false;
        begin.disabled = false;
        welcomeError.textContent = settings.error?.message ?? "";
        render();
      });
  });
  begin.className = "welcome-start";
  const welcomeLogo = node("img", undefined, "welcome-logo");
  welcomeLogo.src = new URL(
    "../src-tauri/icons/128x128@2x.png",
    import.meta.url,
  ).href;
  welcomeLogo.alt = "모퉁이 라디오 로고";
  welcomeLogo.width = 96;
  welcomeLogo.height = 96;
  const identity = node("div", undefined, "welcome-identity");
  const website = button("홈페이지 ↗", "모퉁이 라디오 홈페이지 열기", () => {
    void invoke("open_about_page", { page: "website" }).catch(() => {
      welcomeError.textContent =
        "홈페이지를 열 수 없습니다. 잠시 후 다시 시도해 주세요.";
    });
  });
  website.className = "welcome-website";
  const meta = node("div", undefined, "welcome-meta");
  meta.append(
    node("span", `버전 ${appMetadata.version}`, "welcome-version"),
    website,
  );
  identity.append(
    welcomeLogo,
    node("p", "화면 한켠에, 늘 함께", "welcome-eyebrow"),
    intro,
    node(
      "p",
      "좋아하는 한국 라디오를 한곳에서, 무료로.",
      "welcome-description",
    ),
    meta,
  );
  const tips = node("div", undefined, "welcome-tips");
  tips.append(
    node("span", "메뉴 막대·트레이에서 간편하게"),
    node("span", "채널 순서와 이동 대상을 내 취향대로"),
  );
  const consentCard = node("div", undefined, "welcome-consent-card");
  consentCard.append(
    optLabel,
    node(
      "p",
      "더 편한 라디오를 만드는 데 도움이 됩니다. 선택하지 않아도 모든 기능을 이용할 수 있어요.",
      "welcome-privacy",
    ),
  );
  const privacy = node("details", undefined, "welcome-details");
  privacy.append(
    node("summary", "어떤 정보를 보내나요?"),
    node(
      "p",
      "앱 실행·재생·기능 사용과 무작위 설치 식별자를 PostHog 미국 리전으로 전송합니다. 채널명·프로그램명·화면은 수집하지 않습니다. 통계는 90일 보관 정책이며, 설정에서 언제든 끌 수 있습니다.",
      "welcome-privacy",
    ),
  );
  consentCard.append(privacy);
  const welcomeBody = node("div", undefined, "welcome-body");
  welcomeBody.append(identity, tips, consentCard, welcomeError);
  const welcomeActions = node("div", undefined, "welcome-actions");
  welcomeActions.append(
    node("p", "방송은 재생 버튼을 눌렀을 때만 시작됩니다.", "welcome-footnote"),
    begin,
  );
  welcome.append(welcomeBody, welcomeActions);
  root.replaceChildren(welcome, shell);
  let headerState = "";
  let poller: ProgramPoller | undefined,
    resized = "",
    sizeQueue = Promise.resolve();
  const miniControls = node("div", undefined, "mini-controls");
  function resize() {
    const isMini = miniPlayer && panel === "channels";
    const compact = isMini || (!channelsVisible && panel === "channels");
    const height = isMini
      ? Math.max(98, header.offsetHeight + hero.offsetHeight + 20)
      : compact
        ? Math.max(
            200,
            header.offsetHeight
              ? Math.ceil(header.offsetHeight + hero.offsetHeight + channelToggle.offsetHeight + 16)
              : 240,
          )
        : 640;
    const sizeKey = `${isMini}:${compact}:${height}`;
    if (sizeKey === resized) return;
    resized = sizeKey;
    sizeQueue = sizeQueue.then(async () => {
      try {
        await invoke("set_player_size", {
          mini: compact,
          height,
          miniPlayer: isMini,
        });
      } catch {
        actionError = "창 크기를 변경하지 못했습니다.";
        if (!disposed) render();
      }
    });
  }
  function program(id: string) {
    return currentProgram(programs.get(id) ?? unavailable(id));
  }
  function artwork(
    target: HTMLElement,
    s?: Station,
    p?: ProgramState,
    small = false,
  ) {
    const url = safeArtwork(p?.imageUrl),
      key = `${s?.id}:${url}`;
    if (target.dataset.art === key) return;
    target.dataset.art = key;
    target.replaceChildren();
    const fallback = () => {
      target.replaceChildren(
        node("span", s?.providerId.toUpperCase() ?? "RADIO", "cover-mark"),
      );
    };
    if (url) {
      const img = node("img");
      img.src = url;
      img.alt = small ? "" : `${p?.title ?? s?.name} 프로그램 이미지`;
      img.referrerPolicy = "no-referrer";
      img.onload = () => {
        if (target.dataset.art !== key) return;
        // Near-square portraits fill the cover; wide artwork keeps its lettering.
        img.classList.toggle(
          "portrait",
          img.naturalWidth / img.naturalHeight > 0.8 &&
            img.naturalWidth / img.naturalHeight < 1.25,
        );
      };
      img.onerror = () => {
        if (target.dataset.art === key) fallback();
      };
      target.append(img);
    } else fallback();
  }
  async function loadSchedule(id: string, force = false) {
    if (pending.has(id) || (!force && schedules.has(id))) return;
    pending.add(id);
    try {
      const r = await invoke<Result<Schedule>>("get_schedule", {
        stationId: id,
      });
      if (
        !disposed &&
        r.ok &&
        r.data.stationId === id &&
        Array.isArray(r.data.entries)
      )
        schedules.set(id, r.data);
      else schedules.delete(id);
    } catch {
      schedules.delete(id);
    } finally {
      pending.delete(id);
      if (!disposed) render();
    }
  }
  function openSchedule(id: string) {
    analytics.capture("feature_used", { feature: "schedule" });
    scheduleId = id;
    scheduleDate = dayKey(Date.now());
    scheduleFocusPending = true;
    panel = "schedule";
    void loadSchedule(id, true);
    render();
  }
  function showChannels() {
    panel = "channels";
    render();
  }
  function render() {
    updateNotice.hidden = !updater.ready;
    if (disposed || channelDragging) return;
    const onboarding = ready && !settings.settings.onboardingCompleted;
    welcome.hidden = !onboarding;
    shell.hidden = onboarding;
    if (onboarding) {
      if (!welcomeInitialized) {
        opt.checked = settings.settings.analyticsEnabled === true;
        welcomeInitialized = true;
      }
      document.documentElement.dataset.theme =
        settings.settings.appearance ?? "system";
      welcomeError.textContent = settings.error?.message ?? "";
      return;
    }
    const focused = (document.activeElement as HTMLElement | null)?.dataset.key,
      scroll = main.scrollTop;
    document.documentElement.dataset.theme =
      settings.settings.appearance ?? "system";
    const compact = !channelsVisible && panel === "channels";
    const isMini = miniPlayer && panel === "channels";
    shell.classList.toggle("mini-player", isMini);
    if (isMini && control.parentElement !== miniControls) {
      miniControls.append(previousChannel, control, nextChannel);
      heroTop.append(miniControls);
    } else if (!isMini && control.parentElement === miniControls) {
      dialLabels.prepend(previousChannel);
      dialLabels.append(nextChannel);
      heroBottom.append(control);
      miniControls.remove();
    }
    shell.classList.toggle("channels-collapsed", compact);
    channelToggle.hidden = panel !== "channels";
    channelToggleLabel.textContent = channelsVisible
      ? "채널 닫기"
      : "채널 펼치기";
    channelToggle.setAttribute("aria-expanded", String(channelsVisible));
    shell.classList.toggle("panel-open", panel !== "channels");
    if (
      headerState !== `${panel}:${pinned}:${pinBusy}:${scheduleId}:${isMini}`
    ) {
      headerState = `${panel}:${pinned}:${pinBusy}:${scheduleId}:${isMini}`;
      const heading = node(
        "h1",
        panel === "settings"
          ? "설정"
          : panel === "schedule"
            ? `${stations.find((s) => s.id === scheduleId)?.name ?? "방송"} 편성표`
            : "모퉁이 라디오",
      );
      heading.title = pinned ? "드래그해서 플레이어 이동" : "모퉁이 라디오";
      if (panel === "channels") {
        const logo = glyph(
          "M3 6h12.5L20 10.5V18H3V6 M15.5 6v4.5H20 M6 6V3.5l10-2 M13.5 14h3 M10.5 12a2.5 2.5 0 1 0-5 0a2.5 2.5 0 1 0 5 0",
        );
        logo.classList.add("brand-logo");
        heading.classList.add("brand-heading");
        heading.replaceChildren(logo, node("span", "모퉁이 라디오"));
      }
      heading.onpointerdown = (event) => {
        if (!pinned || event.button !== 0) return;
        void invoke("start_player_drag").catch(() => {
          actionError = "창을 이동할 수 없습니다.";
          render();
        });
      };
      header.replaceChildren(heading);
      header.classList.toggle("draggable", pinned);
      if (panel !== "channels")
        header.append(button("← 돌아가기", "돌아가기", showChannels));
      if (panel === "channels") {
        const mode = button(
          "",
          isMini ? "일반 화면으로" : "미니모드로 전환",
          () => {
            miniPlayer = !miniPlayer;
            render();
          },
          "player-mode",
        );
        mode.className = "mode-button";
        mode.title = isMini ? "일반 화면으로" : "미니모드로 전환";
        mode.append(
          glyph(
            isMini
              ? "M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"
              : "M3 8h5V3M21 8h-5V3M8 21v-5H3M16 21v-5h5",
          ),
        );
        header.append(mode);
      }
      header.append(
        (() => {
          const pin = button(
            "",
            pinned ? "플레이어 고정 해제" : "플레이어 고정",
            () => {
              if (pinBusy) return;
              pinBusy = true;
              render();
              void invoke("set_player_pinned", { pinned: !pinned })
                .then(() => {
                  analytics.capture("feature_used", { feature: "pin" });
                  pinned = !pinned;
                  return applyOpacity();
                })
                .catch(() => {
                  actionError = "플레이어 고정을 변경할 수 없습니다.";
                })
                .finally(() => {
                  pinBusy = false;
                  render();
                });
            },
            "pin",
          );
          pin.className = "pin-button";
          pin.title = pinned ? "고정 해제" : "고정하고 드래그해서 이동";
          pin.setAttribute("aria-pressed", String(pinned));
          pin.disabled = pinBusy;
          const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg",
          );
          svg.setAttribute("viewBox", "0 0 24 24");
          svg.setAttribute("aria-hidden", "true");
          const path = document.createElementNS(svg.namespaceURI, "path");
          path.setAttribute("d", "M8 3h8M9 3v6l-3 4v2h12v-2l-3-4V3M12 15v6");
          svg.append(path);
          pin.append(svg);
          return pin;
        })(),
      );
      if (pinned) {
        const row = node("label", undefined, "transparency-control"),
          slider = node("input"),
          value = node("output", `${transparency}%`);
        slider.type = "range";
        slider.min = "0";
        slider.max = "60";
        slider.step = "1";
        slider.value = String(60 - transparency);
        slider.setAttribute("aria-label", "플레이어 투명도");
        slider.title = `투명도 ${transparency}%`;
        slider.setAttribute("aria-valuetext", `투명도 ${transparency}%`);
        slider.dataset.key = "transparency";
        slider.oninput = () => {
          transparency = 60 - Number(slider.value);
          value.textContent = `${transparency}%`;
          slider.title = `투명도 ${transparency}%`;
          slider.setAttribute("aria-valuetext", `투명도 ${transparency}%`);
          void applyOpacity().catch(() => {
            actionError = "투명도를 변경할 수 없습니다.";
            render();
          });
        };
        row.append(node("span", "투명도"), slider, value);
        header.insertBefore(row, header.querySelector(".pin-button"));
      }
      const gear = button("", "설정", () => {
        panel = panel === "settings" ? "channels" : "settings";
        if (panel === "settings" && supportsAutostart) void autostart.refresh();
        render();
      });
      gear.className = "settings-button";
      gear.title = panel === "settings" ? "설정 닫기" : "설정";
      gear.setAttribute("aria-pressed", String(panel === "settings"));
      gear.append(
        glyph(
          "M9.5 3h5l.7 2.5 2 .9 2.4-.6 2.5 4.3-1.7 1.8v2.2l1.7 1.8-2.5 4.3-2.4-.6-2 .9-.7 2.5h-5l-.7-2.5-2-.9-2.4.6L1.9 16l1.7-1.8V12.1l-1.7-1.8 2.5-4.3 2.4.6 2-.9z M15.5 12.5a3.5 3.5 0 1 0-7 0a3.5 3.5 0 1 0 7 0",
        ),
      );
      if (!isMini) header.append(gear);
    }
    const state = player.state,
      current = stations.find((s) => s.id === state.stationId),
      p = state.stationId ? program(state.stationId) : null;
    if (ready) syncTray(current, p);
    artwork(cover, current, p ?? undefined);
    titleFlow.update(
      p?.status === "available"
        ? (p.title ?? "프로그램 정보 없음")
        : current
          ? "프로그램 정보 없음"
          : "듣고 싶은 방송을 골라보세요",
    );
    stationLabel.textContent =
      current?.name ??
      (state.stationId ? "이용 불가 채널" : "내 곁의 작은 라디오");
    airtime.textContent =
      p?.status === "available"
        ? `${time.format(new Date(p.startsAt!))}–${time.format(new Date(p.endsAt!))}`
        : "실시간 라디오";
    const busy = ["playing", "loading"].includes(state.status);

    control.replaceChildren(
      glyph(busy ? "M7 5h4v14H7zM14 5h4v14h-4z" : "M8 4l13 8-13 8z"),
    );
    control.classList.toggle("connecting", state.status === "loading");
    control.title =
      state.status === "loading"
        ? "연결 중 · 누르면 정지"
        : busy
          ? "방송 정지"
          : "방송 재생";
    tunedName.textContent = current?.name ?? "채널 선택";
    tunedName.title = tunedName.textContent;
    control.setAttribute("aria-pressed", String(busy));
    const adjacent = neighbors();
    previousChannelName.textContent = adjacent.previous?.name ?? "이전 채널";
    nextChannelName.textContent = adjacent.next?.name ?? "다음 채널";
    previousChannelName.title = previousChannelName.textContent;
    nextChannelName.title = nextChannelName.textContent;
    stationName.title = stationName.textContent ?? "";
    previousChannel.disabled = !adjacent.previous;
    nextChannel.disabled = !adjacent.next;
    previousChannel.setAttribute(
      "aria-label",
      adjacent.previous ? `이전 채널: ${adjacent.previous.name}` : "이전 채널",
    );
    nextChannel.setAttribute(
      "aria-label",
      adjacent.next ? `다음 채널: ${adjacent.next.name}` : "다음 채널",
    );
    control.setAttribute("aria-label", busy ? "방송 정지" : "방송 재생");
    control.disabled = !current;
    error.textContent = state.error ? `오디오: ${state.error.message}` : "";
    if (compact || isMini)
      error.textContent = [
        error.textContent,
        settings.error?.message,
        actionError,
      ]
        .filter(Boolean)
        .join(" / ");
    error.hidden = !error.textContent;
    const now = Date.now();
    const nextSlot = (
      schedules.get(state.stationId ?? "")?.entries ?? []
    ).reduce<Schedule["entries"][number] | undefined>((next, entry) => {
      const start = Date.parse(entry.startsAt);
      return start > now && (!next || start < Date.parse(next.startsAt))
        ? entry
        : next;
    }, undefined);
    next.textContent = nextSlot
      ? `다음 ${dayKey(nextSlot.startsAt) !== dayKey(Date.now()) ? "내일 " : ""}${time.format(new Date(nextSlot.startsAt))} · ${nextSlot.title}  ›`
      : pending.has(state.stationId ?? "")
        ? "다음 방송 확인 중…"
        : "다음 방송 · 편성표 보기  ›";
    next.disabled = !current;
    next.title = next.textContent;
    if (document.activeElement !== volume)
      volume.value = String(settings.settings.volume);
    volumeValue.textContent = `${volume.value}%`;
    mute.textContent = Number(volume.value) === 0 ? "음소거 해제" : "음소거";
    if (panel === "settings" && main.querySelector(".settings")) {
      const check = main.querySelector<HTMLInputElement>(
        "input[type=checkbox]",
      );
      if (check) check.checked = autostart.enabled;
      main
        .querySelectorAll<HTMLButtonElement>(".appearance button")
        .forEach((b) =>
          b.setAttribute(
            "aria-pressed",
            String(
              b.dataset.value === (settings.settings.appearance ?? "system"),
            ),
          ),
        );
      const alert = main.querySelector(".settings-error");
      if (alert)
        alert.textContent = [
          settings.error?.message,
          autostart.error?.message,
          actionError,
        ]
          .filter(Boolean)
          .join(" · ");
      const sharing = main.querySelector<HTMLInputElement>(
        "[data-key=analytics]",
      );
      if (sharing)
        sharing.checked = settings.settings.analyticsEnabled === true;
      const updateStatus = main.querySelector(".update-setting [role=status]");
      if (updateStatus) updateStatus.textContent = updater.message;
      const updateAction =
        main.querySelector<HTMLButtonElement>(".update-action");
      if (updateAction) {
        updateAction.textContent = updater.ready
          ? "업데이트하고 재시작"
          : "업데이트 확인";
        updateAction.disabled = updater.busy;
      }
      const restartNote = main.querySelector<HTMLElement>(".restart-note");
      if (restartNote) restartNote.hidden = !updater.ready;
      if (ready) resize();
      return;
    }
    main.replaceChildren();
    main.setAttribute(
      "aria-label",
      panel === "channels"
        ? "방송 목록"
        : panel === "settings"
          ? "설정"
          : "편성표",
    );
    for (const message of [catalogError, settings.error?.message, actionError])
      if (message) {
        const alert = node("p", message, "error");
        alert.setAttribute("role", "alert");
        main.append(alert);
      }
    if (panel === "settings") {
      const section = node("section", undefined, "settings");
      section.append(volumeBox);
      const appearance = node("div", undefined, "appearance");
      appearance.append(node("h3", "화면 모드"));
      for (const [value, label] of [
        ["system", "시스템"],
        ["light", "라이트"],
        ["dark", "다크"],
      ] as const) {
        const b = button(label, `${label} 모드`, () => {
          void settings.update((s) => ({ ...s, appearance: value }));
        });
        b.setAttribute(
          "aria-pressed",
          String((settings.settings.appearance ?? "system") === value),
        );
        b.dataset.value = value;
        appearance.append(b);
      }
      const label = node("label", "로그인 시 실행", "autostart"),
        check = node("input");
      check.type = "checkbox";
      check.checked = autostart.enabled;
      check.disabled = !supportsAutostart;
      check.dataset.key = "autostart";
      check.onchange = () => {
        void autostart.set(check.checked);
      };
      label.append(check);
      section.append(
        appearance,
        label,
        node(
          "p",
          !supportsAutostart
            ? "스토어판의 로그인 시 실행은 준비 중입니다."
            : "실행 시 자동 재생하지 않습니다.",
          "muted",
        ),
      );
      const settingsError = node(
        "p",
        autostart.error?.message,
        "error settings-error",
      );
      settingsError.setAttribute("role", "alert");
      section.append(settingsError);
      if (!isAppStore) {
        const updateSection = node("section", undefined, "update-setting");
        const updateMessage = node("p", updater.message, "muted");
        updateMessage.setAttribute("role", "status");
        const updateButton = button(
          updater.ready ? "업데이트하고 재시작" : "업데이트 확인",
          "앱 업데이트",
          () => {
            void (updater.ready ? updater.install() : updater.check());
          },
        );
        updateButton.classList.add("update-action");
        updateButton.disabled = updater.busy;
        updateSection.append(
          node("h3", "앱 업데이트"),
          updateMessage,
          updateButton,
        );
        const restartNote = node(
          "p",
          "재생이 종료되고 앱이 다시 시작됩니다.",
          "muted restart-note",
        );
        restartNote.hidden = !updater.ready;
        updateSection.append(restartNote);
        section.append(updateSection);
      } else {
        section.append(
          node("p", `업데이트는 ${distributionName}에서 제공됩니다.`, "muted"),
        );
      }
      const about = node("details", undefined, "about-app");
      about.append(node("summary", "모퉁이 라디오 정보"));
      about.append(
        node("h3", "모퉁이 라디오"),
        node("p", `버전 ${appMetadata.version} · ${distributionName}`, "muted"),
        node("p", "화면 한켠에서, 좋아하는 한국 라디오를 한곳에."),
      );
      for (const [page, label] of [
        ["website", "홈페이지 ↗"],
        ["privacy", "개인정보처리방침 ↗"],
        ["github", "GitHub ↗"],
        ["license", "오픈소스 라이선스 ↗"],
      ]) {
        about.append(
          button(label, label, () => {
            void invoke("open_about_page", { page }).catch(() => {
              actionError = "페이지를 열 수 없습니다.";
              render();
            });
          }),
        );
      }
      about.ontoggle = () => {
        if (ready) resize();
      };
      const sharingLabel = node("label", "사용 통계 공유", "autostart");
      const sharing = node("input");
      sharing.type = "checkbox";
      sharing.dataset.key = "analytics";
      sharing.checked = settings.settings.analyticsEnabled === true;
      sharing.disabled = !analytics.configured;
      sharing.onchange = () => {
        const enabled = sharing.checked;
        if (!enabled) analytics.setEnabled(false);
        void settings.update((s) => ({ ...s, analyticsEnabled: enabled }));
      };
      sharingLabel.append(sharing);
      section.append(
        sharingLabel,
        node(
          "p",
          analytics.configured
            ? "선택 사항 · 실행·재생·기능 사용을 PostHog 미국(US) 리전으로 전송합니다. 채널명과 화면은 수집하지 않습니다."
            : "통계 연결 준비 중입니다. 현재 전송하지 않습니다.",
          "muted",
        ),
      );
      section.append(about);
      section.append(
        button("앱 종료", "앱 종료", () => {
          void invoke("quit_app").catch(() => {
            actionError = "앱을 종료할 수 없습니다.";
            render();
          });
        }),
      );
      main.append(section);
    } else if (panel === "schedule") {
      const station = stations.find((s) => s.id === scheduleId);
      const scheduleHeading = node("h2", station?.name ?? "편성표");
      scheduleHeading.title = scheduleHeading.textContent ?? "편성표";
      main.append(scheduleHeading, node("p", "편성표 · 한국 시간", "muted"));
      const allEntries = schedules.get(scheduleId ?? "")?.entries ?? [];
      const dates = [
        ...new Set(allEntries.map((e) => dayKey(e.startsAt))),
      ].sort();
      if (!dates.includes(scheduleDate) && dates.length)
        scheduleDate = dates.includes(dayKey(Date.now()))
          ? dayKey(Date.now())
          : dates[0];
      const dateNav = node("nav", undefined, "schedule-dates");
      dateNav.setAttribute("aria-label", "편성표 날짜");
      for (const date of dates) {
        const b = button(
          `${dateLabel.format(new Date(`${date}T12:00:00+09:00`))}${date === dayKey(Date.now()) ? " · 오늘" : ""}`,
          `${date} 편성표`,
          () => {
            scheduleDate = date;
            main.scrollTop = 0;
            render();
          },
        );
        b.setAttribute("aria-pressed", String(date === scheduleDate));
        dateNav.append(b);
      }
      main.append(dateNav);
      const entries = allEntries.filter(
        (e) => dayKey(e.startsAt) === scheduleDate,
      );
      if (pending.has(scheduleId ?? ""))
        main.append(node("p", "편성표 불러오는 중…", "muted"));
      else if (!entries.length)
        main.append(node("p", "편성 정보가 없습니다.", "muted"));
      for (const entry of entries) {
        const past = Date.parse(entry.endsAt) <= Date.now(),
          current = !past && Date.parse(entry.startsAt) <= Date.now(),
          item = node(
            "article",
            undefined,
            `schedule-row${current ? " current" : past ? " past" : ""}`,
          );
        const entryTitle = node("strong", entry.title);
        entryTitle.title = entry.title;
        item.append(
          node(
            "span",
            `${time.format(new Date(entry.startsAt))}–${time.format(new Date(entry.endsAt))}`,
            "program-time",
          ),
          entryTitle,
          node(
            "span",
            current ? "현재 방송" : past ? "방송 종료" : "예정",
            "schedule-state",
          ),
        );
        main.append(item);
      }
      if (
        entries.length &&
        !entries.some((e) => Date.parse(e.startsAt) > Date.now())
      )
        main.append(node("p", "이후 편성 미제공", "muted"));
      if (station)
        main.append(
          button("공식 편성표 ↗", "공식 편성표 확인", () => {
            void invoke("open_station_page", { stationId: station.id }).catch(
              () => {
                actionError = "공식 페이지를 열 수 없습니다.";
                render();
              },
            );
          }),
          button("새로고침", "편성표 새로고침", () => {
            void loadSchedule(station.id, true);
            render();
          }),
        );
    } else if (ready) {
      const rows = channelRows(stations, settings.settings), visible = rows.all;
      const heading = node("div", undefined, "channel-list-heading");
      const edit = button(editingChannels ? "완료" : "채널 편집", editingChannels ? "채널 편집 완료" : "채널 편집", () => {
        editingChannels = !editingChannels;
        render();
      }, "edit-channels");
      edit.className = "channel-edit-button";
      edit.setAttribute("aria-pressed", String(editingChannels));
      heading.append(node("strong", editingChannels ? "채널 편집" : "채널"), edit);
      main.append(heading);
      if (editingChannels) {
        main.append(node("p", "체크한 채널만 이전·다음으로 이동해요. 목록에서는 모든 채널을 들을 수 있어요.", "channel-edit-help"));
        const columns = node("div", undefined, "channel-edit-columns");
        columns.append(node("span", "끌어서 순서 변경"), node("span", "넘길 때 포함"));
        main.append(columns);
      }
      if (visible.length && visible.every((row) => settings.settings.disabledChannelIds.includes(row.id))) {
        const notice = node("div", undefined, "channel-empty-navigation");
        notice.append(node("span", "넘길 채널을 선택해 주세요."));
        if (!editingChannels) notice.append(button("선택하기", "넘길 채널 선택하기", () => { editingChannels = true; render(); }));
        main.append(notice);
      }
      for (const row of visible) {
        const item = node("div", undefined, "station");
        item.classList.toggle("selected", row.id === state.stationId);
        const choose = button(
          "",
          `${row.name} 재생`,
          () => {
            analytics.capture("channel_changed", { method: "list" });
            void player.select(row.id);
          },
          `station-all-${row.id}`,
        );
        choose.className = "station-choice";
        choose.disabled = !row.available;
        const thumb = node("div", undefined, "cover thumbnail");
        const rowProgram = program(row.id);
        artwork(thumb, row.station, rowProgram, true);
        const copy = node("span", undefined, "station-copy");
        copy.append(
          node("strong", row.name),
          node(
            "span",
            row.available
              ? (rowProgram.title ?? "프로그램 정보 없음")
              : "이용 불가 · 삭제된 채널",
            "program",
          ),
        );
        copy.title = `${row.name} · ${copy.querySelector(".program")?.textContent ?? ""}`;
        choose.append(thumb, copy);
        const schedule = button(
          "편성표",
          `${row.name} 편성표`,
          () => openSchedule(row.id),
          `schedule-all-${row.id}`,
        );
        schedule.className = "schedule-button";
        schedule.disabled = !row.available;
        const excluded = settings.settings.disabledChannelIds.includes(row.id);
        item.dataset.stationId = row.id;
        item.classList.toggle("channel-editing", editingChannels);
        if (excluded && !editingChannels) {
          copy.append(node("span", "넘기기 제외", "channel-skip-badge"));
        }
        const toggle = node("input");
        toggle.type = "checkbox";
        toggle.checked = !excluded;
        toggle.dataset.key = `channel-enabled-${row.id}`;
        toggle.className = "channel-include";
        toggle.setAttribute("aria-label", `${row.name} 넘길 때 포함`);
        toggle.addEventListener("change", () => {
          const included = toggle.checked;
          void settings.update((s) => ({ ...s, disabledChannelIds: included
            ? s.disabledChannelIds.filter((id) => id !== row.id)
            : [...new Set([...s.disabledChannelIds, row.id])] }));
        });
        const handle = button(
          "⠿",
          `${row.name} 순서 변경`,
          () => {},
          `reorder-${row.id}`,
        );
        handle.className = "channel-drag";
        handle.title = "드래그 또는 위·아래 방향키로 순서 변경";
        handle.addEventListener("keydown", (event) => {
          if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
          event.preventDefault();
          const ids = channelRows(stations, settings.settings).all.map(
            (r) => r.id,
          );
          const target =
            ids[ids.indexOf(row.id) + (event.key === "ArrowUp" ? -1 : 1)];
          if (target)
            void settings.update((s) => ({
              ...s,
              channelOrder: moveChannel(stations, s, row.id, target),
            }));
        });
        handle.addEventListener("pointerdown", (event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          handle.setPointerCapture(event.pointerId);
          channelDragging = true;
          let target: string | undefined;
          const clear = () =>
            main
              .querySelectorAll(".drop-target")
              .forEach((el) => el.classList.remove("drop-target"));
          const move = (e: PointerEvent) => {
            clear();
            const bounds = main.getBoundingClientRect();
            if (e.clientY < bounds.top + 28) main.scrollTop -= 18;
            if (e.clientY > bounds.bottom - 28) main.scrollTop += 18;
            const over = document
              .elementFromPoint(e.clientX, e.clientY)
              ?.closest<HTMLElement>("[data-station-id]");
            target = over?.dataset.stationId;
            if (target && target !== row.id) over?.classList.add("drop-target");
          };
          const finish = (e: PointerEvent) => {
            clear();
            channelDragging = false;
            handle.removeEventListener("pointermove", move);
            handle.removeEventListener("pointerup", finish);
            handle.removeEventListener("pointercancel", finish);
            if (handle.hasPointerCapture(event.pointerId))
              handle.releasePointerCapture(event.pointerId);
            if (e.type === "pointerup" && target) {
              const to = target;
              void settings.update((s) => ({
                ...s,
                channelOrder: moveChannel(stations, s, row.id, to),
              }));
            }
          };
          handle.addEventListener(
            "lostpointercapture",
            () => {
              channelDragging = false;
              render();
            },
            { once: true },
          );
          handle.addEventListener("pointermove", move);
          handle.addEventListener("pointerup", finish);
          handle.addEventListener("pointercancel", finish);
        });
        if (editingChannels) item.append(handle, choose, toggle);
        else item.append(choose, schedule);
        main.append(item);
      }
      for (const id of rows.removed)
        main.append(node("p", `${id} · 마지막 채널 이용 불가`, "error"));
      if (infoError) main.append(node("p", infoError, "muted"));
    } else main.append(node("p", "방송 목록을 불러오는 중입니다."));
    main.scrollTop = scroll;
    if (
      panel === "schedule" &&
      scheduleFocusPending &&
      !pending.has(scheduleId ?? "")
    ) {
      const active = main.querySelector<HTMLElement>(".schedule-row.current");
      if (active)
        main.scrollTop = Math.max(0, active.offsetTop - main.offsetTop - 140);
      else main.scrollTop = 0;
      scheduleFocusPending = false;
    }
    if (focused)
      Array.from(root.querySelectorAll<HTMLElement>("[data-key]"))
        .find((e) => e.dataset.key === focused)
        ?.focus({ preventScroll: true });
    if (ready) resize();
  }
  let selectedId: string | null = null;
  let trayKey = "";
  let trayQueue = Promise.resolve<unknown>(undefined);
  let opacityQueue = Promise.resolve<unknown>(undefined);
  function applyOpacity() {
    const percent = pinned ? 100 - transparency : 100;
    const next = opacityQueue
      .catch(() => {})
      .then(() => invoke("set_player_opacity", { percent }));
    opacityQueue = next;
    return next;
  }
  function syncTray(station: Station | undefined, p: ProgramState | null) {
    const state = {
      station: station?.name ?? "",
      program: p?.status === "available" ? (p.title ?? "") : "",
      playing: player.state.status === "playing",
      busy: ["playing", "loading"].includes(player.state.status),
    };
    const key = JSON.stringify(state);
    if (key === trayKey) return;
    trayKey = key;
    trayQueue = trayQueue
      .then(() => invoke("set_tray_state", state))
      .catch(() => {
        if (trayKey === key) trayKey = "";
      });
  }
  player.subscribe(() => {
    analytics.playback(player.state);
    render();
    const id = player.state.stationId;
    if (ready && id && id !== selectedId) {
      selectedId = id;
      void loadSchedule(id);
    }
  });
  let removeTray: UnlistenFn | undefined;
  void listen<string>("tray-action", ({ payload }) => {
    if (disposed) return;
    if (payload === "playback") {
      if (["playing", "loading"].includes(player.state.status)) player.stop();
      else void player.play();
    } else if (payload === "open" || payload === "settings") {
      panel = payload === "settings" ? "settings" : "channels";
      if (panel === "settings" && supportsAutostart) void autostart.refresh();
      render();
    }
  })
    .then((remove) => {
      if (disposed) remove();
      else removeTray = remove;
    })
    .catch(() => {});
  await settings.load();
  if (!isAppStore) updater.start();
  channelsVisible = settings.settings.playerMode !== "mini";
  lastVolume = settings.settings.volume || 100;
  player.restore(settings.settings.lastStationId, settings.settings.volume);
  try {
    const r = await invoke<Result<Catalog>>("list_stations");
    if (r.ok)
      stations = r.data.stations.filter(
        (s) => s.groupId !== "tbn" || s.id === "tbn-gyeongin",
      );
    else catalogError = r.error.message;
  } catch {
    catalogError = "방송 목록을 불러올 수 없습니다. 앱을 다시 열어 주세요.";
  }
  ready = true;
  render();
  // Let the first layout settle and native resizing finish before revealing the window.
  await sizeQueue;
  await invoke("frontend_ready").catch(() => {});
  if (player.state.stationId) void loadSchedule(player.state.stationId);
  poller = new ProgramPoller(
    stations.map((s) => s.id),
    async (stationIds) => {
      const r = await invoke<Result<ProgramState[]>>("get_programs", {
        stationIds,
      });
      if (!r.ok) {
        infoError = "정보 갱신 실패 · 재생은 유지됩니다.";
        throw new Error();
      }
      infoError = "";
      return r.data;
    },
    (values) => {
      programs = new Map(values.map((value) => [value.stationId, value]));
      render();
    },
  );
  void poller.refresh();
  const refresh = () => {
    if (!document.hidden) {
      void poller?.refresh();
      const id = panel === "schedule" ? scheduleId : player.state.stationId;
      if (id) void loadSchedule(id, true);
      if (panel === "settings" && supportsAutostart) void autostart.refresh();
    }
  };
  const timer = setInterval(() => {
    render();
    const id = player.state.stationId;
    if (
      id &&
      (schedules
        .get(id)
        ?.entries.every((e) => Date.parse(e.endsAt) <= Date.now()) ||
        Date.now() - Date.parse(schedules.get(id)?.fetchedAt ?? "") > 300000)
    )
      void loadSchedule(id, true);
  }, 60000);
  document.addEventListener("visibilitychange", refresh);
  window.addEventListener("focus", refresh);
  return () => {
    disposed = true;
    analytics.dispose();
    updater.dispose();
    clearInterval(timer);
    poller?.stop();
    lifecycle();
    removeTray?.();
    titleFlow.dispose();
    player.dispose();
    document.removeEventListener("visibilitychange", refresh);
    window.removeEventListener("focus", refresh);
  };
}
