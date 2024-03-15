# SIMDE
[![Build Status](https://travis-ci.org/etsiiull/SIMDE.svg?branch=master)](https://travis-ci.org/etsiiull/SIMDE)
[![All Contributors](https://img.shields.io/github/all-contributors/SIMDE-ULL/SIMDE?color=ee8449&style=flat-square)](#contributors)

![Live exec](/assets/exec.gif)

## What is SIMDE?

SIMDE is a simulator for supporting teaching of [ILP (Instruction Level Parallelism)](https://en.wikipedia.org/wiki/Instruction-level_parallelism) Architectures. 

This simulator is a visual representation of a Superecalar machine execution and the students are able to see how the instructions move through the multiple stages of the pipeline. 

This make easier to learn concepts suchs as *Tomasulo's algorithm* and the purpose of structures such as the reorderbuffer.

## Technologies

SIMDE is powered by Typescript, React, Redux, Sass and Webpack.

## How to use

[Go to the project website and start learning](https://etsiiull.github.io/SIMDE/)

## Development

SIMDE is build on top of typescript,sass and webpack. In order to make the build easier a docker file environment has been added.
Just install docker and docker-compose and type:

`docker-compose up`

All services should be configurated and ready for deployment.

Please beware that we copy the package.json each time we build the image so if you add more dependencies you should run `docker-compose build` in order to recreate the image.

## Troubling?

If you have any doubt you should check [the official docs](https://etsiiull.gitbooks.io/simde/).

## License

The project has been released under GPLv3 License.

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
