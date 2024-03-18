# SIMDE

<p align="center">
    <a href="https://github.com/SIMDE-ULL/SIMDE/actions/workflows/build.yml"><img alt="SIMDE Build Status" src="https://img.shields.io/github/actions/workflow/status/SIMDE-ULL/SIMDE/build.yml" /></a>
    <a href="https://github.com/SIMDE-ULL/SIMDE?tab=GPL-3.0-1-ov-file"><img alt="SIMDE License" src="https://img.shields.io/github/license/SIMDE-ULL/SIMDE" /></a>
    <a href="https://github.com/SIMDE-ULL/SIMDE/stargazers"><img alt="SIMDE Stars" src="https://img.shields.io/github/stars/SIMDE-ULL/SIMDE" /></a>
    <a href="https://github.com/SIMDE-ULL/SIMDE?tab=readme-ov-file#contributors"><img alt="SIMDE Contributors" src="https://img.shields.io/github/all-contributors/SIMDE-ULL/SIMDE?color=red" /></a>
</p>

<p align="center">
    <img width="480px" alt="SIMDE Logo" src="https://github.com/SIMDE-ULL/SIMDE/assets/25517190/6af8eb99-8b46-4f08-a78a-195863fff035" />
</p>

> <p align="center">🖥️ Run <b>SIMDE</b> directly from your browser: <a href="https://SIMDE-ULL.github.io/SIMDE/">https://SIMDE-ULL.github.io/SIMDE/</a></p>

__SIMDE__ is a computer simulator with a strong focus on assisting in learning and education. As a didactic simulator, SIMDE aims to supercharge the teaching of [computer architecture]((https://en.wikipedia.org/wiki/Computer_architecture)) principles with a pragmatic, _learn-by-doing_ approach.

When used in supporting educational practices, SIMDE shines both for reproducing architectural concepts, such as [_Tomasulo's algorithm_](https://en.wikipedia.org/wiki/Tomasulo%27s_algorithm) and representing organizational structures, like [_re-order buffers_](https://en.wikipedia.org/wiki/Re-order_buffer).

## This is how SIMDE looks in action

![SIMDE in action](https://github.com/SIMDE-ULL/SIMDE/assets/25517190/32e20b09-ecf5-45a1-9057-6a708426a6be)

## Features

* Designed to be simple and enjoyable to use.
* Includes several forms of visualizing computer units and memory data.
* Cross-platform, accessible from any modern web browser.
* _Superscalar_ architecture simulation.
* _Very Long Instruction Word_ (VLIW) architecture simulation.
* Multiple instruction processing modes, including [batch processing](https://en.wikipedia.org/wiki/Batch_processing).
* Instruction flow tracing to visually follow instructions through the pipeline.
* Project uses modern development standards.
* _Free_ as in _Freedom_ (see [License](#license) further below).

## Getting started

### Using the official web instance

SIMDE can be accessed directly from any modern browser of your choice at:

 [https://SIMDE-ULL.github.io/SIMDE/](https://SIMDE-ULL.github.io/SIMDE/)

## Building from sources

### Prerequisites

Make sure that the following tools are installed in your system:

* [Node.js](https://nodejs.org/en) (version >=18).
* [pnpm](https://pnpm.io/) (version >=8).

### Build steps

1. Install the project dependencies:
```bash
pnpm install --frozen-lockfile
```

2. Build the static site:
```bash
pnpm build
```

The generated build will be available in the `dist/` directory generated in the root directory of the project. The static files can be served using a HTTP server, such as [Apache httpd](https://httpd.apache.org/), [NGINX](https://www.nginx.com/) or [Traefik](https://traefik.io/).

## Contributing
See [CONTRIBUTING](CONTRIBUTING.md).

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/icasrod"><img src="https://avatars.githubusercontent.com/u/17193911?v=4?s=100" width="100px;" alt="Iván Castilla Rodríguez"/><br /><sub><b>Iván Castilla Rodríguez</b></sub></a><br /><a href="#research-icasrod" title="Research">🔬</a> <a href="#projectManagement-icasrod" title="Project Management">📆</a> <a href="#mentoring-icasrod" title="Mentoring">🧑‍🏫</a> <a href="#ideas-icasrod" title="Ideas, Planning, & Feedback">🤔</a> <a href="#example-icasrod" title="Examples">💡</a> <a href="#doc-icasrod" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://adrianabreu.gitlab.io"><img src="https://avatars.githubusercontent.com/u/9080392?v=4?s=100" width="100px;" alt="Adrian Abreu Gonzalez"/><br /><sub><b>Adrian Abreu Gonzalez</b></sub></a><br /><a href="#platform-adrianabreu" title="Packaging/porting to new platform">📦</a> <a href="#design-adrianabreu" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/alu0100884012"><img src="https://avatars.githubusercontent.com/u/22546849?v=4?s=100" width="100px;" alt="alu0100884012"/><br /><sub><b>alu0100884012</b></sub></a><br /><a href="#platform-alu0100884012" title="Packaging/porting to new platform">📦</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://oxca.be"><img src="https://avatars.githubusercontent.com/u/25517190?v=4?s=100" width="100px;" alt="Óscar Carrasco"/><br /><sub><b>Óscar Carrasco</b></sub></a><br /><a href="#mentoring-oxcabe" title="Mentoring">🧑‍🏫</a> <a href="#maintenance-oxcabe" title="Maintenance">🚧</a> <a href="#platform-oxcabe" title="Packaging/porting to new platform">📦</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/endes0"><img src="https://avatars.githubusercontent.com/u/5920682?v=4?s=100" width="100px;" alt="endes0"/><br /><sub><b>endes0</b></sub></a><br /><a href="#test-endes0" title="Tests">⚠️</a> <a href="#maintenance-endes0" title="Maintenance">🚧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

SIMDE is licensed under the [GNU General Public License v3.0 only](https://spdx.org/licenses/GPL-3.0-only.html).

The rationale behind this decision is that we, the SIMDE authors, believe that society must strive for free, accessible, high quality educational resources. Given that, SIMDE will always be _"Free as in Freedom"_ for anyone to use anywhere, at any time.

## Citation and papers

In papers and reports, please refer to SIMDE as follows: "The SIMDE contributors. SIMDE. https://github.com/SIMDE-ULL/SIMDE" or using the following BibTeX code (preferred):

```tex
@misc{SIMDE, 
        title={SIMDE}, 
        howpublished = {\url{https://github.com/SIMDE-ULL/SIMDE}}, 
        url={https://github.com/SIMDE-ULL/SIMDE}, 
        author={Castilla Rodr{\'i}guez, Iv{\'a}n and Abreu Gonzalez, Adrian and Carrasco, {\'O}scar and D{\'i}az Arteaga, Melissa and La spina, Francesco}, 
        organization = {Universidad de La Laguna}} 
```

### Papers

These are some papers talking about SIMDE you can cite. If you are writing a paper referencing SIMDE, feel free to add it to this list through opening [an issue](https://github.com/SIMDE-ULL/SIMDE/issues/new).

```tex
@inproceedings{Rodrguez2004SIMDEUS,
  title={SIMDE: un simulador para el apoyo docente en la ense{\~n}anza de las Arquitecturas ILP con planificaci{\'o}n din{\'a}mica y est{\'a}tica},
  author={Iv{\'a}n Castilla Rodr{\'i}guez and Lorenzo Moreno Ruiz and Jos{\'e} Francisco Sigut Saavedra and Carina Gonz{\'a}lez and Evelio J. Gonz{\'a}lez},
  year={2004},
  url={https://api.semanticscholar.org/CorpusID:171841142}
}


@article{Castilla2007SIMDEAE,
  title={SIMDE: An educational simulator of ILP architectures with dynamic and static scheduling},
  author={Ivan Castilla and Lorenzo Moreno Ruiz and Carina Soledad Gonz{\'a}lez-Gonz{\'a}lez and Jos{\'e} F. Sigut and Evelio Jos{\'e} Gonz{\'a}lez Gonz{\'a}lez},
  journal={Computer Applications in Engineering Education},
  year={2007},
  volume={15},
  url={https://api.semanticscholar.org/CorpusID:27505992}
}


@article{abreu2017simulador,
  title={Simulador did{\'a}ctico de arquitectura de computadores},
  author={Abreu Gonz{\'a}lez, Adri{\'a}n},
  year={2017},
  url={http://riull.ull.es/xmlui/handle/915/5125}
}


@article{lopez2018plataforma,
  title={Plataforma de ludificaci{\'o}n de un simulador did{\'a}ctico de arquitectura de computadores},
  author={L{\'o}pez Garnier, Antonio Jes{\'u}s and others},
  year={2018},
  url={https://riull.ull.es/xmlui/handle/915/9406}
}


@article{diaz2019simulador,
  title={Simulador did{\'a}ctico de una arquitectura de planificaci{\'o}n est{\'a}tica.},
  author={D{\'\i}az Arteaga, Melissa},
  year={2019},
  url={http://riull.ull.es/xmlui/handle/915/12393}
}


@article{carrasco2022simulador,
  title={Simulador did{\'a}ctico de arquitectura de computadores: aplicaci{\'o}n de metodolog{\'\i}as de integraci{\'o}n y mantenimiento},
  author={Carrasco Ben{\'\i}tez, {\'O}scar and others},
  year={2022},
  url={http://riull.ull.es/xmlui/handle/915/30298}
}
```