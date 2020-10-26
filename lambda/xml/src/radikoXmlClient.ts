import fetch from "node-fetch";

export async function radikoTokyoStations(): Promise<string> {
  const url = "http://radiko.jp/v3/station/list/JP13.xml";
  return await getXml(url);
}

export async function radikoWeeklyProgramsBy(stationId: string): Promise<string> {
  const url = `http://radiko.jp/v3/program/station/weekly/${stationId}.xml`;
  return await getXml(url);
}

async function getXml(url: string): Promise<string> {
  const response = await fetch(url);
  return await response.text();
}
