import { describe, it, expect } from "vitest";
import { parsePrograms, imageUrl } from "./programs";
const now = Date.parse("2026-11-01T11:30:00+09:00");
const row = {
  channel_code: "22",
  local_station_code: "00",
  program_planned_date: "20261101",
  program_planned_start_time: "11000000",
  program_planned_end_time: "12000000",
  program_title: "현재 방송",
  image_w: "https://programres.kbs.co.kr/current.jpg",
};
const kbs = (r = row) => [
  { channel_code: "22", local_station_code: "00", schedules: [r] },
];
describe("program artwork", () => {
  it("uses exact KBS channel, region and current time interval", () => {
    expect(parsePrograms("kbs", kbs(), now).get("kbs-22")?.title).toBe(
      "현재 방송",
    );
    for (const patch of [
      { channel_code: "21" },
      { local_station_code: "10" },
      { program_planned_date: "20261031" },
    ])
      expect(parsePrograms("kbs", kbs({ ...row, ...patch }), now).size).toBe(0);
    expect(
      parsePrograms("kbs", kbs(), Date.parse("2026-11-01T12:00:00+09:00")).size,
    ).toBe(0);
  });
  it("rejects image host spoofing, credentials, HTTP and unrelated provider hosts", () => {
    for (const u of [
      "http://programres.kbs.co.kr/a",
      "https://programres.kbs.co.kr.evil.test/a",
      "https://user@programres.kbs.co.kr/a",
      "https://programres.kbs.co.kr:444/a",
      "https://programres.kbs.co.kr/a#x",
      "https://image.cloud.sbs.co.kr/a",
    ])
      expect(imageUrl(u, "kbs")).toBeUndefined();
  });
  it("keeps title but falls back when image is invalid", () => {
    expect(
      parsePrograms(
        "kbs",
        kbs({ ...row, image_w: "https://evil.test/a" }),
        now,
      ).get("kbs-22")?.image,
    ).toBeUndefined();
  });
  it("uses square SBS art only for matching title and homepage", () => {
    const r = {
      channel: "power",
      onair_flag: "Y",
      start_time: "11:00",
      end_time: "12:00",
      title: "방송",
      hom_url: "https://programs.sbs.co.kr/radio/show",
      onair: { image: "https://image.cloud.sbs.co.kr/wide.png" },
    };
    const d = {
      schedule: { power: [r] },
      main_clip: [
        {
          link_url: r.hom_url,
          image_alt: "다른 방송",
          image_square: "https://image.cloud.sbs.co.kr/wrong.jpg",
        },
      ],
    };
    expect(parsePrograms("sbs", d, now).get("sbs-powerpc")?.image).toContain(
      "wide.png",
    );
    d.main_clip[0].image_alt = "방송";
    expect(parsePrograms("sbs", d, now).get("sbs-powerpc")?.image).toContain(
      "wrong.jpg",
    );
  });
  it("supports midnight spans, refuses wrong cpbc channel and expired slots", () => {
    const r = {
      channelid: "RADIO",
      title: "심야",
      starttime: "23:00",
      endtime: "01:00",
      thumbimg: "https://img.cpbc.co.kr/art.jpg",
    };
    expect(
      parsePrograms(
        "cpbc",
        { onair: { info: r } },
        Date.parse("2026-11-01T00:30:00+09:00"),
      ).get("cpbc-seoul")?.title,
    ).toBe("심야");
    expect(parsePrograms("cpbc", { onair: { info: r } }, now).size).toBe(0);
    expect(
      parsePrograms("cpbc", { onair: { info: { ...r, channelid: "TV" } } }, now)
        .size,
    ).toBe(0);
  });
});
