import { parse, X2jOptionsOptional } from "fast-xml-parser";
import { TransformedPrograms, TransformedProgram, RadikoRoot } from "../../shared/programs.type";

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
