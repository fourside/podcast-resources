import { router } from "../src/router";
import { getProgramsController, getStationsController, postProgramController } from "../src/controllers";
import { ClientError } from "../src/ClientError";

describe("router", () => {
  it("should return getStationsController", () => {
    // arrange
    const method = "GET";
    const path = "/stations";

    // act
    const controller = router(method, path);

    // assert
    expect(controller.name).toBe(getStationsController.name);
  });

  it("should return getProgramsController", () => {
    // arrange
    const method = "GET";
    const path = "/programs/hogefuga";

    // act
    const controller = router(method, path);

    // assert
    expect(controller.name).toBe(getProgramsController.name);
  });

  it("should return postProgramController", () => {
    // arrange
    const method = "POST";
    const path = "/program";

    // act
    const controller = router(method, path);

    // assert
    expect(controller.name).toBe(postProgramController.name);
  });

  it("should throw client exception", () => {
    // arrange
    const method = "PUT";
    const path = "/program";

    // act & assert
    expect(() => {
      router(method, path);
    }).toThrowError(ClientError);
  });
});
