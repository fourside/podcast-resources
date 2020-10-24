#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { PodcastResourcesStack } from "../lib/podcast-resources-stack";

const app = new cdk.App();
new PodcastResourcesStack(app, "PodcastResourcesStack");
