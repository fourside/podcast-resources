export interface TransformedPrograms {
  date: number;
  programs: TransformedProgram[];
}

export interface TransformedProgram {
  id: string;
  ft: string;
  to: string;
  dur: string;
  title: string;
  url: string;
  info: string;
  img: string;
  personality: string;
}

interface Meta {
  name: string;
  value: string;
}

interface Metas {
  meta: Meta;
}

interface Prog2 {
  id: string;
  master_id: string;
  ft: string;
  to: string;
  ftl: string;
  tol: string;
  dur: string;
  title: string;
  url: string;
  failed_record: number;
  ts_in_ng: number;
  ts_out_ng: number;
  desc: string;
  info: string;
  pfm: string;
  img: string;
  tag: any;
  genre: any;
  metas: Metas;
}

interface Prog {
  date: number;
  prog: Prog2[];
}

interface Station {
  id: string;
  name: string;
  progs: Prog[];
}

interface Stations {
  station: Station;
}

interface Radiko {
  ttl: number;
  srvtime: number;
  stations: Stations;
}

export interface RadikoRoot {
  radiko: Radiko;
}
