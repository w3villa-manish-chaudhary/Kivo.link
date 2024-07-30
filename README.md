<p align="center"><a href="https://Kivo.Link.it" title="Kivo.Link.it"><img src="https://raw.githubusercontent.com/thedevs-network/Kivo.Link/9d1c873897c3f5b9a1bd0c74dc5d23f2ed01f2ec/static/images/logo-github.png" alt="Kivo.Link.it"></a></p>

# Kivo.Link.it

**Kivo.Link** is a modern URL shortener with support for custom domains. Shorten URLs, manage your links and view the click rate statistics.

_Contributions and bug reports are welcome._

[https://Kivo.Link.it](https://Kivo.Link.it)

[![Build Status](https://travis-ci.org/thedevs-network/Kivo.Link.svg?branch=v2-beta)](https://travis-ci.org/thedevs-network/Kivo.Link)
[![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/thedevs-network/Kivo.Link/#contributing)
[![GitHub license](https://img.shields.io/github/license/thedevs-network/Kivo.Link.svg)](https://github.com/thedevs-network/Kivo.Link/blob/develop/LICENSE)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/thedevs-network/Kivo.Link/.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fthedevs-network%2FKivo.Link%2F)

## Table of Contents

- [Key Features](#key-features)
- [Stack](#stack)
- [Setup](#setup)
- [Browser Extensions](#browser-extensions)
- [API](#api)
- [Integrations](#integrations)
- [3rd Party Packages](#3rd-party-packages)
- [Donate](#donate)
- [Contributing](#contributing)

## Key Features

- Free and open source.
- Custom domain support.
- Custom URLs for shortened links
- Set password for links.
- Set description for links.
- Expiration time for links.
- Private statistics for shortened URLs.
- View, edit, delete and manage your links.
- Admin account to view, delete and ban links.
- Ability to disable registration and anonymous link creation for private use.
- RESTful API.

## Stack

- Node (Web server)
- Express (Web server framework)
- Passport (Authentication)
- React (UI library)
- Next (Universal/server-side rendered React)
- Easy Peasy (State management)
- styled-components (CSS styling solution library)
- Recharts (Chart library)
- PostgreSQL (database)
- Redis (Cache layer)

## Setup

### Manual

You need to have [Node.js](https://nodejs.org/), [PostgreSQL](https://www.postgresql.org/) and [Redis](https://redis.io/) installed.

1. Clone this repository or [download the latest zip](https://github.com/thedevs-network/Kivo.Link/releases).
2. Copy `.example.env` to `.env` and fill it properly ([see below](#configuration)).
3. Install dependencies: `npm install`.
4. Run for development: `npm run dev`.
5. Run for production: `npm run build` then `npm start`.

### Docker

1. Download the [`docker-compose.yml`](https://raw.githubusercontent.com/thedevs-network/Kivo.Link/develop/docker-compose.yml) and the [`.docker.env`](https://raw.githubusercontent.com/thedevs-network/Kivo.Link/develop/.docker.env) files.
2. Rename `.docker.env` to `.env` and fill it properly ([see below](#configuration)).
3. To execute Kivo.Link you simply have to run `docker-compose up -d` command and then the app should be ready on port "3000".

The `docker-compose.yml` uses the official Kivo.Link docker image available on [Docker Hub](https://hub.docker.com/r/Kivo.Link/Kivo.Link).

### Configuration

For the minimal configuration the following settings have to be changed in the `.env`-file:

- **DEFAULT_DOMAIN**: The domain of your Kivo.Link instance
- **DB_**: The DB credentials (when you use docker-compose you can skip these)
- **ADMIN_EMAILS**: A comma-separated list of the administrator-accounts
- **RECAPTCHA_**: Enter your credentials to use reCaptchas or delete this setting if you don't want to use it
- **MAIL_**: Enter the SMTP-server's credentials (The experience shows SSL works better than STARTTLS; The mail config is required to easily create accounts, see [this comment](https://github.com/thedevs-network/Kivo.Link/issues/269#issuecomment-628604256) how it can be done manually)
- **REPORT_EMAIL**: Kivo.Link offers a form to report malicious links which are sent to this mail-address

## Browser Extensions

Download Kivo.Link's extension for web browsers via below links. You can also find the source code on [Kivo.Link-extension](https://github.com/abhijithvijayan/Kivo.Link-extension).

- [Chrome](https://chrome.google.com/webstore/detail/Kivo.Link/pklakpjfiegjacoppcodencchehlfnpd)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/Kivo.Link/)

## API

Visit API v2 documentation on [docs.Kivo.Link.it](https://docs.Kivo.Link.it)

## Integrations

### ShareX

You can use Kivo.Link as your default URL shortener in [ShareX](https://getsharex.com/). If you host your custom instance of Kivo.Link, refer to [ShareX wiki](https://github.com/thedevs-network/Kivo.Link/wiki/ShareX) on how to setup.

### Alfred Workflow

Download Kivo.Link's official workflow for [Alfred](https://www.alfredapp.com/) app from [alfred-Kivo.Link](https://github.com/thedevs-network/alfred-Kivo.Link) repository.

## 3rd Party packages
| Language   | Link                                                                              | Description                                        |
| ---------- | --------------------------------------------------------------------------------- | -------------------------------------------------- |
| C# (.NET)  | [Kivo.LinkSharp](https://github.com/0xaryan/Kivo.LinkSharp)                                 | .NET package for Kivo.Link.it url shortener             |
| C# (.NET)  | [Kivo.Link.NET](https://github.com/AlphaNecron/Kivo.Link.NET)                               | ✂️🔗 C# API Wrapper for Kivo.Link
| Python     | [Kivo.Link-cli](https://github.com/RealAmirali/Kivo.Link-cli)                               | Command-line client for Kivo.Link written in Python     |
| Ruby       | [Kivo.Link.rb](https://github.com/RealAmirali/Kivo.Link.rb)                                 | Kivo.Link library written in Ruby                       |
| Rust       | [urlshortener](https://github.com/vityafx/urlshortener-rs)                        | URL shortener library written in Rust              |
| Rust       | [Kivo.Link-rs](https://github.com/robatipoor/Kivo.Link-rs)                                  | Command line tool written in Rust                  |
| Node.js    | [node-Kivo.Link](https://github.com/ardalanamini/node-Kivo.Link)                            | Node.js client for Kivo.Link.it url shortener           |
| JavaScript | [Kivo.Link-vscode](https://github.com/mehrad77/Kivo.Link-vscode)                            | Visual Studio Code extension for Kivo.Link              |
| Java       | [Kivo.Link-desktop](https://github.com/cipher812/Kivo.Link-desktop)                         | A Cross platform Java desktop application for Kivo.Link |
| Go         | [Kivo.Link-go](https://github.com/raahii/Kivo.Link-go)                                      | Go client for Kivo.Link.it url shortener                |
| BASH       | [GitHub Gist](https://gist.github.com/hashworks/6d6e4eae8984a5018f7692a796d570b4) | Simple BASH function to access the API             |
| BASH       | [url-shortener](https://git.tim-peters.org/Tim/url-shortener)                     | Simple BASH script with GUI                        |

## Donate

<img src="./btc.png" alt="Kivo.Link.it" width="32px" height="32px">

Kivo.Link is free of charge and free of ads. Help us keep our servers running and motivate us to work on this project by donating to our Bitcoin wallet:

```
1P89WxNTinKxxDQ4FmC4jis3KUdfA9fLJB
```

## Contributing

Pull requests are welcome. You'll probably find lots of improvements to be made.

Open issues for feedback, requesting features, reporting bugs or discussing ideas.

Special thanks to [Thomas](https://github.com/trgwii) and [Muthu](https://github.com/MKRhere). Logo design by [Muthu](https://github.com/MKRhere).

