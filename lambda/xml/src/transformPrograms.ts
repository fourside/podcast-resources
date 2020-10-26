import { parse, X2jOptionsOptional } from "fast-xml-parser";

export function transformPrograms(programsXml: string): TransformedPrograms[] {
  const parseOptions: X2jOptionsOptional = {
    ignoreAttributes: false,
    attributeNamePrefix: "",
  };
  const json: RadikoRoot = parse(programsXml, parseOptions);
  const weeklyPrograms = json.radiko.stations.station.progs;
  return weeklyPrograms.map((program) => {
    const date = program.date;
    const programs: TransformedProgram[] = program.prog.map((program) => {
      return {
        id: program.id,
        ft: program.ft,
        to: program.to,
        dur: program.dur,
        title: program.title,
        url: program.url,
        info: program.info,
        img: program.img,
        personality: program.pfm,
      };
    });
    return {
      date,
      programs,
    };
  });
}

interface TransformedPrograms {
  date: number;
  programs: TransformedProgram[];
}

interface TransformedProgram {
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

interface RadikoRoot {
  radiko: Radiko;
}
