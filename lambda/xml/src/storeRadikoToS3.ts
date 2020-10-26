import { radikoTokyoStations, radikoWeeklyProgramsBy } from "./radikoXmlClient";
import { transformStations } from "./transformStations";
import { transformPrograms } from "./transformPrograms";
import { putStations, putPrograms } from "./s3Client";

export async function store(bucketName: string): Promise<void> {
  const stationsXml = await radikoTokyoStations();
  const stations = transformStations(stationsXml);
  const response = await putStations(bucketName, stations);
  console.log("put stations", response);

  for (const station of stations) {
    const programsXml = await radikoWeeklyProgramsBy(station.id);
    const programs = transformPrograms(programsXml);
    const response = await putPrograms(bucketName, station.id, programs);
    console.log("put programs", station.id, response);
  }
}
