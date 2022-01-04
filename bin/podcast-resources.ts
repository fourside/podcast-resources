#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { PodcastResourcesStack } from "../lib/podcast-resources-stack";

const app = new App();
new PodcastResourcesStack(app, "PodcastResourcesStack");
