import { describe, expect, it } from "vitest";
import { searchStations } from "./search";

const stations = [
  { id: "kbs-1", name: "KBS 1Radio", providerId: "kbs" },
  { id: "sbs-power", name: "SBS 파워FM", providerId: "sbs" },
  { id: "cbs-music", name: "CBS 음악FM", providerId: "cbs" },
];
const programs = new Map([
  ["kbs-1", "오늘 아침 정지영입니다"],
  ["sbs-power", "두시탈출 컬투쇼"],
]);

describe("searchStations", () => {
  it("matches channel names and broadcaster names without case sensitivity", () => {
    expect(
      searchStations(stations, "  파워fm ", programs).map((s) => s.id),
    ).toEqual(["sbs-power"]);
    expect(searchStations(stations, "KBS", programs).map((s) => s.id)).toEqual([
      "kbs-1",
    ]);
  });

  it("matches current program titles and returns all stations for an empty query", () => {
    expect(
      searchStations(stations, "컬투쇼", programs).map((s) => s.id),
    ).toEqual(["sbs-power"]);
    expect(searchStations(stations, "  ", programs)).toEqual(stations);
  });
});
