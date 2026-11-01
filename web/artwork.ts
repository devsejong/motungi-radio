import type { Program } from "./programs";
type Station = { id: string; name: string; providerId: string };
/** Local channel wordmark; not an official broadcaster logo asset. */
export function artwork(station: Station, className: string) {
  const box = document.createElement("span");
  box.className = className + " artwork";
  const fallback = document.createElement("span");
  fallback.className = "channel-logo";
  fallback.setAttribute("role", "img");
  fallback.ariaLabel = station.name + " 채널 로고";
  const brand = document.createElement("strong");
  brand.textContent =
    station.providerId === "cpbc" ? "cpbc" : station.providerId.toUpperCase();
  const label = document.createElement("small");
  label.textContent = station.name.replace(
    new RegExp("^" + station.providerId + "\\s*", "i"),
    "",
  );
  fallback.append(brand, label);
  box.append(fallback);
  let source: string | undefined;
  return {
    element: box,
    update(program?: Program) {
      if (source === program?.image) return;
      source = program?.image;
      box.replaceChildren(fallback);
      if (!source) return;
      const image = new Image();
      image.alt = `${program!.title} 프로그램 이미지`;
      image.referrerPolicy = "no-referrer";
      image.decoding = "async";
      image.onload = () => {
        if (source !== image.src) return;
        image.classList.toggle(
          "wide",
          image.naturalWidth / image.naturalHeight > 1.3,
        );
        box.replaceChildren(image);
      };
      image.onerror = () => {
        if (source === image.src) box.replaceChildren(fallback);
      };
      image.src = source;
    },
  };
}
