import {
  cpSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
const source = readFileSync("site/index.html", "utf8");
const symbols = source.match(/<svg class="symbols"[\s\S]*?<\/svg>/)?.[0];
const main = source.match(/<main id="main">([\s\S]*?)<\/main>/)?.[1];
if (!symbols || !main) throw new Error("Download source markup missing");
writeFileSync("web/download-content.html", symbols + main);
execFileSync("npx", ["vite", "build", "--config", "web/vite.config.ts"], {
  stdio: "inherit",
});
rmSync("dist-site", { recursive: true, force: true });
cpSync("site", "dist-site", { recursive: true });
cpSync("dist-web", "dist-site", { recursive: true });
mkdirSync("dist-site/download", { recursive: true });
const entry = readFileSync("dist-web/index.html", "utf8").replace(
  'href="/icon.svg"',
  'href="/motungi-radio/icon.svg"',
);
writeFileSync("dist-site/index.html", entry);
writeFileSync(
  "dist-site/download/index.html",
  entry.replace(
    "<title>모퉁이 라디오 · 웹 플레이어</title>",
    "<title>PC 앱 다운로드 · 모퉁이 라디오</title>",
  ),
);
console.log(
  "Built radio root and /download/, preserved privacy, updates and download assets.",
);
