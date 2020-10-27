import { PostBody, validatePostBody } from "../src/PostBody";

describe("validatePostBody", () => {
  it("should be valid", () => {
    // arrange
    const postBody = makePostBody();

    // act
    const result = validatePostBody(postBody as PostBody);

    // assert
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  it("should be invalid if title is undefined", () => {
    // arrange
    const postBody = makePostBody();
    postBody.title = undefined;

    // act
    const result = validatePostBody(postBody as PostBody);

    // assert
    expect(result.isValid).toBe(false);
    expect(result.message).toBeDefined();
  });

  it("should be invalid if stationid is undefined", () => {
    // arrange
    const postBody = makePostBody();
    postBody.stationId = undefined;

    // act
    const result = validatePostBody(postBody as PostBody);

    // assert
    expect(result.isValid).toBe(false);
    expect(result.message).toBeDefined();
  });

  it("should be invalid if fromTime is short number string", () => {
    // arrange
    const postBody = makePostBody();
    postBody.fromTime = "20201021";

    // act
    const result = validatePostBody(postBody as PostBody);

    // assert
    expect(result.isValid).toBe(false);
    expect(result.message).toBeDefined();
  });

  it("should be invalid if duration is not number string", () => {
    // arrange
    const postBody = makePostBody();
    postBody.duration = "aaa";

    // act
    const result = validatePostBody(postBody as PostBody);

    // assert
    expect(result.isValid).toBe(false);
    expect(result.message).toBeDefined();
  });

  it("should be invalid if personality is undefined", () => {
    // arrange
    const postBody = makePostBody();
    postBody.personality = undefined;

    // act
    const result = validatePostBody(postBody as PostBody);

    // assert
    expect(result.isValid).toBe(false);
    expect(result.message).toBeDefined();
  });
});

function makePostBody(): Partial<PostBody> {
  return {
    title: "title",
    stationId: "stationId",
    fromTime: "202010101030",
    duration: "180",
    personality: "personality",
  };
}
