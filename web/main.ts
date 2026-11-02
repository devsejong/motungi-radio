import { PlayerController } from "../src/features/player/controller";
import { HtmlAudioTransport } from "../src/features/player/transport";
import { stations, supported, resolve } from "./streams";
import "./style.css";
import appIcon from "../src-tauri/icons/128x128.png";
import { watchPrograms, type Program } from "./programs";
import { artwork } from "./artwork";
let programs = new Map<string, Program>();
const rowArt = new Map<string, ReturnType<typeof artwork>>();
const rowTitles = new Map<string, HTMLElement>();
const rowElements = new Map<string, HTMLElement>();
const playingDots = new Map<string, HTMLElement>();
let heroArt: ReturnType<typeof artwork> | undefined;
let heroStation: string | undefined;
const root = document.querySelector<HTMLElement>("#app")!;
const playable = stations.filter((s) => supported(s.providerId));
let saved: { lastStationId?: string; volume?: number; theme?: string } = {};
try {
  const value = JSON.parse(localStorage.getItem("motungi-web-v1") || "{}");
  if (value && typeof value === "object") saved = value;
} catch {}
function persist(patch: Partial<typeof saved>) {
  saved = { ...saved, ...patch };
  try {
    localStorage.setItem("motungi-web-v1", JSON.stringify(saved));
  } catch {}
}
const player = new PlayerController({
  transport: new HtmlAudioTransport(),
  resolve,
  persist,
});
const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text = "",
  className = "",
) => {
  const n = document.createElement(tag);
  n.textContent = text;
  n.className = className;
  return n;
};
type Icon =
  | "radio"
  | "theme"
  | "play"
  | "stop"
  | "previous"
  | "next"
  | "external"
  | "download"
  | "search"
  | "volume"
  | "up"
  | "down";
const paths: Record<Icon, string> = {
  radio:
    '<path d="M4 9h16v12H4zM5 9l14-6"/><circle cx="9" cy="15" r="3"/><path d="M15 13h2m-2 4h2"/>',
  theme:
    '<circle cx="12" cy="12" r="8"/><path d="M12 4v16"/><path d="M12 4a8 8 0 010 16z" fill="currentColor"/>',
  play: '<path d="M9 5l11 7-11 7z" fill="currentColor" stroke="none"/>',
  stop: '<path d="M8 6v12m8-12v12" stroke-width="3"/>',
  previous: '<path d="M15 6l-6 6 6 6M5 6v12"/>',
  next: '<path d="M9 6l6 6-6 6m10-12v12"/>',
  external: '<path d="M8 16L19 5M11 5h8v8M5 8v11h11"/>',
  download: '<path d="M12 3v12m-5-5l5 5 5-5M5 16v5h14v-5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M16 16l5 5"/>',
  volume:
    '<path d="M4 9h4l5-4v14l-5-4H4zM17 8a6 6 0 010 8m3-11a10 10 0 010 14"/>',
  up: '<path d="M6 15l6-6 6 6"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
};
function icon(name: Icon) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  node.setAttribute("viewBox", "0 0 24 24");
  node.setAttribute("fill", "none");
  node.setAttribute("stroke", "currentColor");
  node.setAttribute("stroke-width", "1.6");
  node.setAttribute("stroke-linecap", "round");
  node.setAttribute("stroke-linejoin", "round");
  node.setAttribute("aria-hidden", "true");
  node.innerHTML = paths[name];
  return node;
}
function setToggle(closed: boolean) {
  toggle.replaceChildren(
    document.createTextNode(closed ? "채널 펼치기" : "채널 닫기"),
    icon(closed ? "down" : "up"),
  );
}
function btn(label: string, text: string, click: () => void, className = "") {
  const b = el("button", text, className);
  b.type = "button";
  b.ariaLabel = label;
  b.onclick = click;
  return b;
}
const header = el("header");
const identity = el("div", "", "identity");
const brandMark = el("span", "", "brand-mark");
brandMark.append(icon("radio"));
const brand = el("a", "모퉁이 라디오", "brand");
brand.href = "https://devsejong.github.io/motungi-radio/";
identity.append(brandMark, brand, el("span", "웹 미리보기", "badge"));
const theme = btn(
  "화면 테마 변경",
  "◐",
  () => {
    const mode =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = mode;
    persist({ theme: mode });
  },
  "icon",
);
theme.replaceChildren(icon("theme"));
header.append(identity, theme);
const card = el("section", "", "player");
card.ariaLabel = "라디오 플레이어";
const hero = el("div", "", "hero");
const logo = el("div", "FM", "art");
const info = el("div", "", "info");
const status = el("p", "", "status");
status.setAttribute("role", "status");
const title = el("h2");
const official = el("a", "공식 홈페이지 ↗", "official");
official.target = "_blank";
official.rel = "noopener noreferrer";
const programTitle = el("p", "", "program-title");
programTitle.hidden = true;
official.replaceChildren(
  document.createTextNode("공식 홈페이지"),
  icon("external"),
);
info.append(title, programTitle, status, official);
hero.append(logo, info);
const play = btn(
  "재생",
  "▶",
  () => {
    if (player.state.status === "playing" || player.state.status === "loading")
      player.stop();
    else void player.play();
  },
  "play",
);
const playContent = el("div", "", "play-content");
playContent.append(info, play);
hero.replaceChildren(logo, playContent);
const error = el("p", "", "error");
error.setAttribute("role", "alert");
error.hidden = true;
const drawer = el("div", "", "drawer");
drawer.id = "channels";
const heading = el("div", "", "list-heading");
heading.append(el("strong", "채널"), el("span", `${playable.length}개 채널`));
const list = el("div", "", "list");
list.setAttribute("role", "list");
const externalHeading = el("h3", "공식 사이트에서 듣기", "external-heading");
const externalList = el("div", "", "list external-list");
externalList.setAttribute("role", "list");
const channelScroll = el("div", "", "channel-scroll");
channelScroll.tabIndex = 0;
channelScroll.setAttribute("role", "region");
channelScroll.ariaLabel = "채널 목록";
const rows = new Map<string, HTMLButtonElement>();
for (const s of stations) {
  const row = el("div", "", "row");
  row.setAttribute("role", "listitem");
  const choice = btn(
    `${s.name} ${supported(s.providerId) ? "재생" : "공식 사이트에서 듣기, 새 창"}`,
    "",
    () => {
      if (supported(s.providerId)) void player.select(s.id);
      else window.open(s.officialPageUrl, "_blank", "noopener,noreferrer");
    },
    "choice",
  );
  const cover = artwork(s, "mark");
  const mark = cover.element;
  rowArt.set(s.id, cover);
  const copy = el("span", "", "copy");
  copy.append(
    el("strong", s.name),
    el(
      "small",
      supported(s.providerId) ? "실시간 방송" : "공식 홈페이지에서 청취",
    ),
  );
  rowTitles.set(s.id, copy.querySelector("small")!);
  const dot = el("span", "", "playing-dot");
  dot.ariaLabel = "실제 재생 중";
  dot.hidden = true;
  playingDots.set(s.id, dot);
  choice.append(mark, copy, dot);
  if (!supported(s.providerId)) {
    const arrow = el("span", "", "external-icon");
    arrow.append(icon("external"));
    choice.append(arrow);
  }
  row.append(choice);
  (supported(s.providerId) ? list : externalList).append(row);
  rows.set(s.id, choice);
  rowElements.set(s.id, row);
}
const emptyState = el("p", "검색 결과가 없습니다.", "empty-state");
emptyState.hidden = true;
channelScroll.append(list, externalHeading, externalList, emptyState);
drawer.append(heading, channelScroll);
const toggle = btn(
  "채널 목록 표시 전환",
  "채널 닫기 ⌃",
  () => {
    drawer.hidden = !drawer.hidden;
    setToggle(drawer.hidden);
    toggle.setAttribute("aria-expanded", String(!drawer.hidden));
  },
  "toggle",
);
toggle.setAttribute("aria-controls", "channels");
toggle.setAttribute("aria-expanded", "true");
card.append(hero, error);
const footer = el("footer");
const help = el("details");
help.append(el("summary", "이용 안내"));
help.append(
  el(
    "p",
    "브라우저·지역에 따라 재생이 제한될 수 있어요. 프로그램 정보는 방송사 제공 기준이며, 편성표는 공식 홈페이지에서 확인해 주세요.",
  ),
);
const privacy = el("a", "개인정보처리방침");
privacy.href = "https://devsejong.github.io/motungi-radio/privacy.html";
footer.append(privacy, help);
help.append(el("p", "웹 미리보기는 사용 통계를 전송하지 않습니다."));
const workspace = el("section", "", "workspace");
const playerPanel = el("div", "", "player-panel");
const downloadPage = el("a", "앱 다운로드 페이지로 이동 ↗", "player-download");
downloadPage.href = "https://devsejong.github.io/motungi-radio/#downloads";
downloadPage.target = "_blank";
downloadPage.rel = "noopener noreferrer";
const bannerIcon = el("img", "", "download-app-icon");
bannerIcon.src = appIcon;
bannerIcon.alt = "";
bannerIcon.width = 48;
bannerIcon.height = 48;
const bannerCopy = el("span", "", "download-banner-copy");
const bannerAction = el("span", "", "download-banner-action");
bannerAction.append(
  document.createTextNode("무료 PC 앱 다운로드"),
  icon("external"),
);
bannerCopy.append(
  el("strong", "모퉁이 라디오 PC 앱"),
  el("span", "메뉴 막대·트레이에서 더 간편하게.", "download-banner-benefit"),
  bannerAction,
);
downloadPage.replaceChildren(bannerIcon, bannerCopy);
downloadPage.ariaLabel =
  "모퉁이 라디오 무료 PC 앱 다운로드 페이지로 이동, 새 창";
const downloadArea = el("div", "", "download-area");
downloadArea.append(downloadPage);
playerPanel.append(card, downloadArea);
workspace.append(playerPanel, drawer, toggle);
root.append(header, workspace, footer);
const desktopLayout = window.matchMedia("(min-width: 840px)");
let mobileDrawerHidden = false;
function syncDrawerForViewport() {
  if (desktopLayout.matches) {
    drawer.hidden = false;
    toggle.hidden = true;
  } else {
    drawer.hidden = mobileDrawerHidden;
    toggle.hidden = false;
    setToggle(mobileDrawerHidden);
    toggle.setAttribute("aria-expanded", String(!mobileDrawerHidden));
  }
}
desktopLayout.addEventListener("change", syncDrawerForViewport);
syncDrawerForViewport();
toggle.onclick = () => {
  mobileDrawerHidden = !mobileDrawerHidden;
  drawer.hidden = mobileDrawerHidden;
  setToggle(mobileDrawerHidden);
  toggle.setAttribute("aria-expanded", String(!mobileDrawerHidden));
};
player.subscribe((state) => {
  const s = stations.find((s) => s.id === state.stationId);
  title.textContent = s?.name || "채널을 선택하세요";
  if (s && heroStation !== s.id) {
    heroStation = s.id;
    heroArt = artwork(s, "hero-art");
    logo.replaceChildren(heroArt.element);
  }
  renderPrograms();
  official.href =
    s?.officialPageUrl || "https://devsejong.github.io/motungi-radio/";
  play.disabled = !s || !supported(s.providerId);
  play.replaceChildren(
    icon(
      state.status === "playing" || state.status === "loading"
        ? "stop"
        : "play",
    ),
  );
  play.ariaLabel =
    state.status === "playing" || state.status === "loading" ? "정지" : "재생";
  status.textContent = state.status === "loading" ? "방송 연결 중…" : "";
  status.hidden = state.status !== "loading";
  error.hidden = !state.error;
  error.textContent = state.error?.message || "";
  for (const [id, b] of rows) {
    if (supported(stations.find((station) => station.id === id)!.providerId))
      b.setAttribute("aria-pressed", String(id === state.stationId));
    const indicator = playingDots.get(id)!;
    const active = id === state.stationId;
    indicator.hidden = !(
      active && ["playing", "loading", "error"].includes(state.status)
    );
    indicator.className = "playing-dot " + (active ? state.status : "");
    indicator.replaceChildren();
    if (active && state.status === "playing") {
      indicator.ariaLabel = "재생 중";
      for (let i = 0; i < 3; i++) indicator.append(el("i"));
    } else {
      indicator.textContent = state.status === "loading" ? "연결 중" : "재시도";
      indicator.ariaLabel =
        state.status === "loading"
          ? "방송 연결 중"
          : "연결 실패, 재생 버튼으로 재시도";
    }
    rowElements
      .get(id)!
      .classList.toggle(
        "is-playing",
        id === state.stationId && state.status === "playing",
      );
  }
});
document.documentElement.dataset.theme =
  saved.theme === "dark" ? "dark" : "light";
player.restore(
  stations.some((s) => s.id === saved.lastStationId)
    ? saved.lastStationId!
    : playable[0].id,
  100,
);
function renderPrograms() {
  const id = player.state.stationId;
  const current = id ? programs.get(id) : undefined;
  heroArt?.update(current);
  const station = stations.find((s) => s.id === id);
  title.textContent = current?.title || station?.name || "채널을 선택하세요";
  title.title = title.textContent;
  programTitle.textContent = station?.name || "";
  programTitle.hidden = !current;
  for (const s of stations) {
    const p = programs.get(s.id);
    rowArt.get(s.id)?.update(p);
    const text = rowTitles.get(s.id)!;
    text.textContent =
      p?.title ||
      (supported(s.providerId) ? "실시간 방송" : "공식 홈페이지에서 청취");
    text.title = p?.title || "";
  }
}
const stopPrograms = watchPrograms((value) => {
  programs = value;
  renderPrograms();
});
window.addEventListener("pagehide", (event) => {
  player.stop();
  if (!event.persisted) stopPrograms();
});
