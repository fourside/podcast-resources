import { parse, X2jOptionsOptional } from "fast-xml-parser";

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

interface TransformedStations {
  id: string;
  name: string;
}

interface Logo {
  "#text": string;
  width: string;
  height: string;
  align: string;
}

interface Station {
  id: string;
  name: string;
  ascii_name: string;
  ruby: string;
  areafree: number;
  timefree: number;
  logo: Logo[];
  banner: string;
  href: string;
  tf_max_delay: number;
}

interface Stations {
  area_id: string;
  area_name: string;
  station: Station[];
}

interface StationsRoot {
  stations: Stations;
}
