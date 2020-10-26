import { transformPrograms } from "../src/transformPrograms";
import * as fs from "fs";
import * as path from "path";

describe("transformPrograms", () => {
  it("should be", () => {
    // arrange
    const programsXml = fs.readFileSync(path.join(__dirname, "./TBS.xml"), "utf-8");

    // act
    const result = transformPrograms(programsXml);

    // assert
    const dates = result.map((e) => e.date);
    expect(dates).toEqual(expect.arrayContaining([20201018]));
    const titles = result.map((e) => e.programs.map((p) => p.title)).flat();
    expect(titles).toEqual(expect.arrayContaining(["JUNK 伊集院光・深夜の馬鹿力"]));
  });
});
