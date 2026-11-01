import catalog from "../resources/stations.json";
import type { ResolvedStream, Result } from "../src/shared/contracts";
const hosts: Record<string, string[]> = {
  kbs: [
    "cfpwwwapi.kbs.co.kr",
    "1radio.gscdn.kbs.co.kr",
    "2radio.gscdn.kbs.co.kr",
    "3radio.gscdn.kbs.co.kr",
    "1fm.gscdn.kbs.co.kr",
    "2fm.gscdn.kbs.co.kr",
    "hanminjokradio.gscdn.kbs.co.kr",
  ],
  sbs: ["apis.sbs.co.kr", "radiolive.sbs.co.kr"],
  cbs: ["m-aac.cbs.co.kr"],
  bbs: ["bbslive.clouducs.com"],
  febc: ["mlive3.febc.net"],
  wbs: ["wbsradio.kr"],
  cpbc: ["apis.cpbc.co.kr", "cdn-radio-seoul.cpbc.co.kr"],
  tbn: ["www.tbn.it.kr"],
};
export const stations = catalog.stations
  .filter((s) => s.providerId !== "tbn" || s.id === "tbn-gyeongin")
  .sort(
    (a, b) => Number(supported(b.providerId)) - Number(supported(a.providerId)),
  );
export function supported(provider: string) {
  return Object.hasOwn(hosts, provider);
}
export function validate(raw: string, provider: string) {
  const u = new URL(raw);
  if (
    u.protocol !== "https:" ||
    u.username ||
    u.password ||
    u.hash ||
    (u.port && u.port !== "443") ||
    !hosts[provider]?.includes(u.hostname)
  )
    throw Error("Invalid URL");
  return u.href;
}
async function text(url: string, provider: string, signal: AbortSignal) {
  const r = await fetch(validate(url, provider), {
    signal,
    credentials: "omit",
    redirect: "error",
    cache: "no-store",
  });
  if (!r.ok) throw Error("Unavailable");
  const reader = r.body?.getReader();
  if (!reader) throw Error("No response");
  let total = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > 262144) throw Error("Response too large");
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  const bytes = new Uint8Array(total);
  let i = 0;
  for (const c of chunks) {
    bytes.set(c, i);
    i += c.length;
  }
  return new TextDecoder().decode(bytes);
}
export async function resolve(
  stationId: string,
  signal: AbortSignal,
): Promise<Result<ResolvedStream>> {
  const s = stations.find((x) => x.id === stationId);
  if (!s || !supported(s.providerId))
    return {
      ok: false,
      error: {
        code: "unavailable",
        message: "이 채널은 공식 홈페이지에서 들을 수 있어요.",
        retryable: false,
      },
    };
  const request = new AbortController();
  let timedOut = false;
  const abort = () => request.abort();
  signal.addEventListener("abort", abort, { once: true });
  if (signal.aborted) abort();
  const timer = setTimeout(() => {
    timedOut = true;
    abort();
  }, 10000);
  const combined = request.signal;
  try {
    let raw = "";
    const p = s.providerId;
    if (p === "kbs") {
      const data = JSON.parse(
        await text(
          `https://cfpwwwapi.kbs.co.kr/api/v1/landing/live/channel_code/${s.streamKey}`,
          p,
          combined,
        ),
      );
      raw = data.channel_item?.find(
        (x: { service_url?: string }) =>
          typeof x.service_url === "string" &&
          x.service_url.startsWith("https://") &&
          x.service_url.includes(".m3u8"),
      )?.service_url;
    }
    if (p === "sbs")
      raw = (
        await text(
          `https://apis.sbs.co.kr/play-api/1.0/livestream/${s.streamKey}?protocol=hls&ssl=Y`,
          p,
          combined,
        )
      ).trim();
    if (p === "cbs")
      raw = `https://m-aac.cbs.co.kr/mweb_${s.streamKey}/_definst_/${s.streamKey}.stream/playlist.m3u8`;
    if (p === "bbs")
      raw =
        "https://bbslive.clouducs.com/bbsradio-mlive/radio.stream/playlist.m3u8";
    if (p === "febc")
      raw = "https://mlive3.febc.net/live5/seoulfm/playlist.m3u8";
    if (p === "cpbc") {
      const data = JSON.parse(
        await text(
          "https://apis.cpbc.co.kr/play-api/2.0/onair/channel/radio?ssl=Y",
          p,
          combined,
        ),
      );
      raw = data.onair?.source?.mediasource?.mediaurl;
    }
    if (p === "tbn")
      raw = "https://www.tbn.it.kr/gyeongin/myStream/playlist.m3u8";
    if (p === "wbs") raw = "https://wbsradio.kr/wbs-seoul";
    return {
      ok: true,
      data: {
        stationId,
        url: validate(raw, p),
        format: p === "wbs" ? "mp3" : "hls",
        resolvedAt: new Date().toISOString(),
      },
    };
  } catch {
    return {
      ok: false,
      error: {
        code: timedOut ? "timeout" : "network",
        message:
          "브라우저에서 방송에 연결하지 못했어요. 다시 시도하거나 공식 홈페이지를 이용해 주세요.",
        retryable: true,
      },
    };
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", abort);
  }
}
