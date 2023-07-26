# dstk
Data science toolkit for easy model registries, deployment, and monitoring

## Overview

dstk is meant to be a most-things-in-one solution for data scientists to:

  1. Easily register models and model versions in an immutable datastore;
  2. Define model deployments in a relatively painless way with minimal configuration and relatively agnostic to the underlying hardware;
  3. Monitor which versions of which models have been deployed at what point(s) in time; and
  4. Do all of this from a native Python REPL, from the CLI, or from a web UI

Think of it like Infrastructure as Code, but for your machine learning models, and in a way that mostly doesn't suck.

## Installation

~ TBD ~

## Usage

~ TBD ~

## Contributing

The best way you can contribute is to actually use this project and leave your feedback [in a new issue](https://github.com/wetherc/dstk/issues/new/choose) or [start a discussion](https://github.com/wetherc/dstk/discussions/new/choose).

At this time I am not accepting pull requests from the community.

## Why dstk?

Naming is hard and I'm too lazy to think of anything more clever.

More generally though, the existing options for model registries and model deployments all feel kind of lacking to me, and so this kind of came about through anger-driven development. The existing tools out there tend to be too all-encompassing and general-purpose (MLFlow) to really provide a seamless and enjoyable experience, or they're proprietary (SageMaker, Azure ML Studio, etc.) and screw that noise.

For about as long as I've been training and deploying ML models, I've wanted a simple, intuitive interface to let me take a model from "trained blob on my local machine" to "deployed with a standard inference API". For some models with specific, unique constraints that's probably not going to ever be a reality. But most models that most companies today are training and deploying are all pretty lightweight and don't have a ton of complexity to them; there's probably no good reason that most of the heavy lifting in getting them deployed isn't able to be automated.