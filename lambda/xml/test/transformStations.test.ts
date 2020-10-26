import { transformStations } from "../src/transformStations";
import * as fs from "fs";
import * as path from "path";

describe("transformStations", () => {
  it("should be", () => {
    // arrange
    const stationsXml = fs.readFileSync(path.join(__dirname, "./JP13.xml"), "utf-8");

    // act
    const result = transformStations(stationsXml);

    // assert
    expect(result.map((e) => e.id)).toContain("TBS");
    expect(result.map((e) => e.name)).toContain("TBSラジオ");
  });
});
