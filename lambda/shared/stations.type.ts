export interface TransformedStations {
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

export interface StationsRoot {
  stations: Stations;
}
