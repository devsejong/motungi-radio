export interface Program {
  title: string;
  image?: string;
  endsAt: number;
}
type Row = Record<string, any>;
const endpoints: Record<string, string> = {
  kbs: "https://static.api.kbs.co.kr/mediafactory/v1/schedule/onair_now?local_station_code=00&channel_code=21,22,23,24,25,26",
  sbs: "https://static.apis.sbs.co.kr/radio-api/gorealra/1.0/main/section/common",
  cpbc: "https://apis.cpbc.co.kr/play-api/2.0/onair/channel/radio?ssl=Y",
};
const imageHosts: Record<string, string[]> = {
  kbs: ["programres.kbs.co.kr", "mediafactory.play.kbs.co.kr"],
  sbs: ["image.cloud.sbs.co.kr"],
  cpbc: ["img.cpbc.co.kr"],
};
export function imageUrl(value: unknown, provider: string): string | undefined {
  if (typeof value !== "string") return;
  try {
    const u = new URL(value);
    if (
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !u.hash &&
      (!u.port || u.port === "443") &&
      imageHosts[provider]?.includes(u.hostname)
    )
      return u.href;
  } catch {}
}
function clock(value: unknown): number | undefined {
  if (typeof value !== "string") return;
  const m = value.includes(":")
    ? value.match(/^(\d{1,2}):(\d{2})$/)
    : value.match(/^(\d{2})(\d{2})\d{0,4}$/);
  if (!m || +m[1] > 24 || +m[2] > 59 || (+m[1] === 24 && +m[2] !== 0)) return;
  return (+m[1] * 60 + +m[2]) * 60000;
}
function slot(
  start: unknown,
  end: unknown,
  now: number,
  date?: unknown,
): number | undefined {
  const a = clock(start),
    b = clock(end);
  if (a === undefined || b === undefined || a === b) return;
  const today = new Date(now + 9 * 3600000).toISOString().slice(0, 10);
  const day =
    typeof date === "string" && /^\d{8}$/.test(date)
      ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`
      : today;
  const midnight = Date.parse(`${day}T00:00:00+09:00`);
  for (const offset of date ? [0] : [0, -86400000]) {
    const s = midnight + offset + a,
      e = midnight + offset + b + (b < a ? 86400000 : 0);
    if (s <= now && now < e) return e;
  }
}
export function parsePrograms(
  provider: string,
  data: any,
  now = Date.now(),
): Map<string, Program> {
  const result = new Map<string, Program>();
  const add = (
    id: string,
    title: unknown,
    start: unknown,
    end: unknown,
    images: unknown[],
    date?: unknown,
  ) => {
    const endsAt = slot(start, end, now, date);
    if (!endsAt || typeof title !== "string" || !title.trim()) return;
    result.set(id, {
      title: title.trim().slice(0, 200),
      endsAt,
      image: images.map((x) => imageUrl(x, provider)).find(Boolean),
    });
  };
  if (provider === "kbs" && Array.isArray(data))
    for (const channel of data) {
      if (
        channel?.local_station_code !== "00" ||
        !Array.isArray(channel.schedules)
      )
        continue;
      for (const row of channel.schedules) {
        if (
          row.channel_code !== channel.channel_code ||
          row.local_station_code !== "00" ||
          !/^\d{8}$/.test(row.program_planned_date)
        )
          continue;
        add(
          `kbs-${channel.channel_code}`,
          row.program_title,
          row.program_planned_start_time,
          row.program_planned_end_time,
          [row.image_w],
          row.program_planned_date,
        );
      }
    }
  if (provider === "sbs")
    for (const key of ["power", "love"])
      for (const row of Array.isArray(data?.schedule?.[key])
        ? data.schedule[key]
        : []) {
        if (row.channel !== key || row.onair_flag !== "Y") continue;
        const clip = Array.isArray(data.main_clip)
          ? data.main_clip.find(
              (c: Row) =>
                c.link_url === row.hom_url && c.image_alt === row.title,
            )
          : undefined;
        add(`sbs-${key}pc`, row.title, row.start_time, row.end_time, [
          clip?.image_square,
          row.onair?.image,
        ]);
      }
  if (provider === "cpbc") {
    const row = data?.onair?.info;
    if (row?.channelid?.toLowerCase() === "radio")
      add("cpbc-seoul", row.title, row.starttime, row.endtime, [
        row.program_image,
        row.thumbimg,
      ]);
  }
  return result;
}
async function fetchPrograms(provider: string): Promise<Map<string, Program>> {
  const controller = new AbortController(),
    timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(endpoints[provider], {
      credentials: "omit",
      redirect: "error",
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok || !response.body) throw Error();
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > 1048576) throw Error();
        chunks.push(value);
      }
    } finally {
      await reader.cancel();
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const c of chunks) {
      bytes.set(c, offset);
      offset += c.length;
    }
    return parsePrograms(provider, JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return new Map();
  } finally {
    clearTimeout(timeout);
  }
}
/** One bounded request per provider. Failure clears prior data; never touches audio. */
export function watchPrograms(
  update: (programs: Map<string, Program>) => void,
) {
  let stopped = false,
    busy = false;
  let current = new Map<string, Program>();
  const refresh = async () => {
    if (busy || stopped || document.hidden) return;
    busy = true;
    const batches = await Promise.all(
      Object.keys(endpoints).map(fetchPrograms),
    );
    if (!stopped) {
      current = new Map(batches.flatMap((m) => [...m]));
      update(current);
    }
    busy = false;
  };
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [id, p] of current) if (p.endsAt <= now) current.delete(id);
    update(current);
    void refresh();
  }, 30000);
  const visibility = () => {
    if (!document.hidden) {
      current = new Map();
      update(current);
      void refresh();
    }
  };
  document.addEventListener("visibilitychange", visibility);
  void refresh();
  return () => {
    stopped = true;
    clearInterval(timer);
    document.removeEventListener("visibilitychange", visibility);
  };
}
