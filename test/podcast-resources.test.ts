import { expect as expectCDK, matchTemplate, MatchStyle } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as PodcastResources from "../lib/podcast-resources-stack";

test("Empty Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new PodcastResources.PodcastResourcesStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT
    )
  );
});
