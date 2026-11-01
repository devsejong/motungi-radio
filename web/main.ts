import { PlayerController } from "../src/features/player/controller";
import { HtmlAudioTransport } from "../src/features/player/transport";
import { stations, supported, resolve } from "./streams";
import "./style.css";
import { watchPrograms, type Program } from "./programs";
import { artwork } from "./artwork";
let programs = new Map<string, Program>();
const rowArt = new Map<string, ReturnType<typeof artwork>>();
const rowTitles = new Map<string, HTMLElement>();
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
function btn(label: string, text: string, click: () => void, className = "") {
  const b = el("button", text, className);
  b.type = "button";
  b.ariaLabel = label;
  b.onclick = click;
  return b;
}
const header = el("header");
const brand = el("a", "모퉁이 라디오", "brand");
brand.href = "https://devsejong.github.io/motungi-radio/";
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
header.append(brand, el("span", "WEB · 미리보기", "badge"), theme);
const intro = el("section", "", "intro");
intro.append(
  el("p", "화면 한켠에, 늘 함께", "eyebrow"),
  el("h1", "설치 없이, 라디오."),
  el("p", "좋아하는 한국 라디오를 한곳에서 무료로."),
);
const card = el("section", "", "player");
card.ariaLabel = "라디오 플레이어";
const hero = el("div", "", "hero");
const logo = el("div", "FM", "art");
const info = el("div", "", "info");
const status = el("p", "재생 버튼을 눌러 시작하세요.", "status");
status.setAttribute("role", "status");
const title = el("h2");
const official = el("a", "공식 홈페이지 ↗", "official");
official.target = "_blank";
official.rel = "noopener noreferrer";
const programTitle = el("p", "", "program-title");
programTitle.hidden = true;
info.append(status, title, programTitle, official);
hero.append(logo, info);
const controls = el("div", "", "controls");
const previous = btn("이전 채널", "‹", () => move(-1), "nav");
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
const next = btn("다음 채널", "›", () => move(1), "nav");
controls.append(previous, play, next);
const error = el("p", "", "error");
error.setAttribute("role", "alert");
error.hidden = true;
const volumeLabel = el("label", "", "volume");
volumeLabel.append(el("span", "음량"));
const volume = el("input");
volume.type = "range";
volume.min = "0";
volume.max = "100";
volume.step = "1";
volume.ariaLabel = "음량";
volume.value = String(
  Number.isFinite(saved.volume)
    ? Math.max(0, Math.min(100, saved.volume!))
    : 100,
);
volume.oninput = () => player.setVolume(Number(volume.value));
volumeLabel.append(volume);
const drawer = el("div", "", "drawer");
drawer.id = "channels";
const heading = el("div", "", "list-heading");
heading.append(el("strong", "채널"), el("span", "방송사에서 직접 연결"));
const list = el("div", "", "list");
list.setAttribute("role", "list");
const rows = new Map<string, HTMLButtonElement>();
for (const s of stations) {
  const row = el("div", "", "row");
  row.setAttribute("role", "listitem");
  const choice = btn(
    `${s.name} ${supported(s.providerId) ? "재생" : "선택"}`,
    "",
    () => {
      if (supported(s.providerId)) void player.select(s.id);
      else {
        persist({ lastStationId: s.id });
        player.restore(s.id, Number(volume.value));
      }
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
  choice.append(mark, copy);
  row.append(choice);
  list.append(row);
  rows.set(s.id, choice);
}
drawer.append(heading, list);
const toggle = btn(
  "채널 목록 표시 전환",
  "채널 닫기 ⌃",
  () => {
    drawer.hidden = !drawer.hidden;
    toggle.textContent = drawer.hidden ? "채널 펼치기 ⌄" : "채널 닫기 ⌃";
    toggle.setAttribute("aria-expanded", String(!drawer.hidden));
  },
  "toggle",
);
toggle.setAttribute("aria-controls", "channels");
toggle.setAttribute("aria-expanded", "true");
card.append(hero, controls, error, volumeLabel, drawer, toggle);
const footer = el("footer");
footer.append(
  el(
    "p",
    "브라우저·지역에 따라 재생이 제한될 수 있어요. 프로그램 정보는 방송사 제공 기준이며, 편성표는 공식 홈페이지에서 확인해 주세요.",
  ),
);
const privacy = el("a", "개인정보처리방침");
privacy.href = "https://devsejong.github.io/motungi-radio/privacy.html";
footer.append(
  privacy,
  el("span", " · 웹 미리보기는 사용 통계를 전송하지 않습니다."),
);
root.append(header, intro, card, footer);
function move(direction: number) {
  const i = playable.findIndex((s) => s.id === player.state.stationId);
  const s =
    playable[
      i < 0
        ? direction > 0
          ? 0
          : playable.length - 1
        : (i + direction + playable.length) % playable.length
    ];
  void player.select(s.id);
}
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
  play.textContent =
    state.status === "playing" || state.status === "loading" ? "Ⅱ" : "▶";
  play.ariaLabel =
    state.status === "playing" || state.status === "loading" ? "정지" : "재생";
  status.textContent =
    state.status === "playing"
      ? "지금 듣는 중"
      : state.status === "loading"
        ? "방송 연결 중…"
        : s && !supported(s.providerId)
          ? "공식 홈페이지에서 들을 수 있어요"
          : "재생 버튼을 눌러 시작하세요.";
  error.hidden = !state.error;
  error.textContent = state.error?.message || "";
  for (const [id, b] of rows)
    b.setAttribute("aria-pressed", String(id === state.stationId));
});
document.documentElement.dataset.theme =
  saved.theme === "dark" ? "dark" : "light";
player.restore(
  stations.some((s) => s.id === saved.lastStationId)
    ? saved.lastStationId!
    : playable[0].id,
  Number(volume.value),
);
function renderPrograms() {
  const id = player.state.stationId;
  const current = id ? programs.get(id) : undefined;
  heroArt?.update(current);
  programTitle.textContent = current?.title || "";
  programTitle.title = current?.title || "";
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
