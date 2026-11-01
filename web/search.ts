type SearchableStation = {
  id: string;
  name: string;
  providerId: string;
};

/** Filter the visible channel catalog by channel, broadcaster, or live program. */
export function searchStations<T extends SearchableStation>(
  stations: readonly T[],
  query: string,
  programs: ReadonlyMap<string, string>,
): T[] {
  const term = query.trim().toLocaleLowerCase("ko-KR");
  if (!term) return [...stations];
  return stations.filter((station) =>
    [station.name, station.providerId, programs.get(station.id) || ""].some(
      (value) => value.toLocaleLowerCase("ko-KR").includes(term),
    ),
  );
}
