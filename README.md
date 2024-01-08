# A compact Steam card by [@jesmak](https://www.github.com/jesmak)

A Home Assistant Lovelace custom card for showing statuses of Steam accounts.

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![GitHub Activity][commits-shield]][commits]

## What is it?

A custom Lovelace card that allows you to easily see what your Steam friends are doing. This card is heavily inspired (and forked from) [kb-steam-card](https://github.com/Kibibit/kb-steam-card) by Kibibit. Kibibit's card hadn't been updated in a few years and I wanted something more compact that would fit nicely in my dashboard, hence, this compact version. Like Kibibit's card, this one also supports a list of Steam entities (displayed in two columns to save vertical space), and single Steam entities. The card is designed so that it will fit nicely in a two column horizontal stack, but will also look nice while displayed in full width.

![image](steam_card.png)

## Support

Hey dude! Help me out for a couple of :beers: or a :coffee:!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/jesmak)

## Options

| Name                       | Type    | Requirement  | Description                                             | Default             |
| -------------------------- | ------- | ------------ | ------------------------------------------------------- | ------------------- |
| type                       | string  | **Required** | `custom:steam-card-compact`                             |                     |
| entity                     | string    **Optional** | Target entity. Either this or entities must be defined. |                     |
| entities                   | string[]| **Optional** | Target entities                                         |                     |
| title                      | string  | **Optional** | Title shown on top of card                              | 'Steam Friends'     |
| game_background            | boolean | **Optional** | Show game header picture as background                  | `false`             |

## How to install

### Manually

1. Download steam-card-compact.js from latest release and copy it to config/www folder on your Home Assistant installation.
2. In Home Assistant settings, open dashboards, click the 3 dots button on the top right of the screen and open resources
3. Add a new resource with path /local/steam-card-compact.js (type JavaScript)
4. Refresh your browser

[commits-shield]: https://img.shields.io/github/commit-activity/y/jesmak/steam-card-compact.svg?style=for-the-badge
[commits]: https://github.com/jesmak/steam-card-compact/commits/main
[license-shield]: https://img.shields.io/github/license/jesmak/steam-card-compact.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/jesmak/steam-card-compact.svg?style=for-the-badge
[releases]: https://github.com/jesmak/steam-card-compact/releases
