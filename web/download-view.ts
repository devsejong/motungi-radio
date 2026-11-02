import markup from "./download-content.html?raw";
export function downloadView(base: string) {
  const section = document.createElement("section");
  section.className = "download-view";
  section.ariaLabel = "PC 앱 소개와 다운로드";
  section.innerHTML = markup;
  for (const img of section.querySelectorAll<HTMLImageElement>("img")) {
    const source = img.getAttribute("src");
    if (source?.startsWith("assets/")) img.src = base + source;
  }
  for (const a of section.querySelectorAll<HTMLAnchorElement>("a")) {
    if (a.getAttribute("href") === "privacy.html")
      a.href = base + "privacy.html";
  }
  const track = section.querySelector<HTMLElement>(".feature-track")!;
  const dots = [...section.querySelectorAll<HTMLButtonElement>("[data-slide]")];
  const arrows = [
    ...section.querySelectorAll<HTMLButtonElement>("[data-direction]"),
  ];
  let index = 0;
  const select = (next: number) => {
    index = Math.max(0, Math.min(dots.length - 1, next));
    track.scrollTo({
      left: index * track.clientWidth,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    dots.forEach((dot, i) =>
      dot.setAttribute("aria-pressed", String(i === index)),
    );
    arrows.forEach(
      (a) =>
        (a.disabled =
          Number(a.dataset.direction) < 0
            ? index === 0
            : index === dots.length - 1),
    );
  };
  dots.forEach((d, i) => (d.onclick = () => select(i)));
  arrows.forEach(
    (a) => (a.onclick = () => select(index + Number(a.dataset.direction))),
  );
  track.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    select(index + (event.key === "ArrowRight" ? 1 : -1));
  });
  track.addEventListener(
    "scroll",
    () => {
      if (!track.clientWidth) return;
      index = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach((dot, i) =>
        dot.setAttribute("aria-pressed", String(i === index)),
      );
      arrows.forEach(
        (a) =>
          (a.disabled =
            Number(a.dataset.direction) < 0
              ? index === 0
              : index === dots.length - 1),
      );
    },
    { passive: true },
  );
  return section;
}
