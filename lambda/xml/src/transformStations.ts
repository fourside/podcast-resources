import { parse, X2jOptionsOptional } from "fast-xml-parser";
import { TransformedStations, StationsRoot } from "../../shared/stations.type";

export function transformStations(stationsXml: string): TransformedStations[] {
  const parseOptions: X2jOptionsOptional = {
    ignoreAttributes: false,
    attributeNamePrefix: "",
  };
  const json: StationsRoot = parse(stationsXml, parseOptions);
  return json.stations.station.map((station) => {
    return {
      id: station.id,
      name: station.name,
    };
  });
}
