# Steam card compact

Home Assistant dashboard card that shows what your Steam friends are playing.

[![GitHub Release][releases-shield]][releases] [![GitHub Release Date][release-date-shield]][releases] [![HACS][hacs-shield]][hacs] [![License][license-shield]](LICENSE)

<p>
<img src="https://raw.githubusercontent.com/jesmak/steam-card-compact/main/docs/images/list-light.png#gh-light-mode-only" width="400" alt="A list of six players: two in a game, one for an hour and twenty minutes and one for twelve minutes, with the games' pictures behind them, then one online, one snoozing and two offline with the time they were last seen">
<img src="https://raw.githubusercontent.com/jesmak/steam-card-compact/main/docs/images/list-dark.png#gh-dark-mode-only" width="400" alt="A list of six players: two in a game, one for an hour and twenty minutes and one for twelve minutes, with the games' pictures behind them, then one online, one snoozing and two offline with the time they were last seen">
<img src="https://raw.githubusercontent.com/jesmak/steam-card-compact/main/docs/images/player-light.png#gh-light-mode-only" width="400" alt="One player's own card: their avatar and level, online, in a game for an hour and twenty minutes, with the game's wide picture and logo behind them">
<img src="https://raw.githubusercontent.com/jesmak/steam-card-compact/main/docs/images/player-dark.png#gh-dark-mode-only" width="400" alt="One player's own card: their avatar and level, online, in a game for an hour and twenty minutes, with the game's wide picture and logo behind them">
</p>

## What is it?

A card for Home Assistant's own [Steam integration](https://www.home-assistant.io/integrations/steam_online/), which
creates a sensor for each Steam friend you follow. It shows who is in a game and for how long, who is online, and how
long ago the others were last seen.

The list puts two players to a row to save room, grouped by what they are doing, with those in a game first. One player
can also have a card of their own, with their game's picture and logo behind them. Clicking a game opens it in the Steam
store.

## Installation

### With HACS

1. Add this repository to HACS custom repositories with type **Dashboard**
2. Search for Steam card compact in HACS and download it
3. Refresh your browser

### Manual

1. Take `dist/steam-card-compact.js` from the source code of the [latest release][releases] and copy it to the
   `config/www` folder of your Home Assistant installation
2. In Home Assistant settings, open dashboards, click the three dots at the top right and open resources
3. Add a new resource with the path `/local/steam-card-compact.js` and type JavaScript
4. Refresh your browser

## Options

The card has a visual editor. Add it from the card picker, and it offers every Steam player there is. The options can
also be written by hand.

| Name                | Type           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                   | Default                                                                         |
| ------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `type`              | string         | **Required.** `custom:steam-card-compact`                                                                                                                                                                                                                                                                                                                                                                                                     |                                                                                 |
| `entity`            | string or list | The player's sensor, or a list of them. Needed unless `auto_populate` is on                                                                                                                                                                                                                                                                                                                                                                   |                                                                                 |
| `auto_populate`     | boolean        | Show every Steam player there is instead of naming them                                                                                                                                                                                                                                                                                                                                                                                       | `false`                                                                         |
| `layout`            | string         | `list`, `player` for one player's own card, or `auto`, which draws their own card when one is named                                                                                                                                                                                                                                                                                                                                           | `auto`                                                                          |
| `title`             | string         | Shown at the top of the list                                                                                                                                                                                                                                                                                                                                                                                                                  | Steam friends, translated                                                       |
| `game_background`   | boolean        | Draw the game's picture behind the player                                                                                                                                                                                                                                                                                                                                                                                                     | `true`                                                                          |
| `height_mode`       | string         | How tall the card is. `auto` fits its content, `fixed` keeps it at `height`, `max` lets it grow up to `max_height`. In `fixed` and `max` the list scrolls below the title, which stays in view, and the card never gets lower than its title and one row of players. The big card for one player has nothing to scroll and never gets lower than the player. A height in grid rows, set in the layout tab of a sections view, is used instead | `fixed` when `height` is set, `max` when only `max_height` is, otherwise `auto` |
| `height`            | number         | The card's height in pixels, for `fixed`                                                                                                                                                                                                                                                                                                                                                                                                      |                                                                                 |
| `max_height`        | number         | The card's greatest height in pixels, for `max`                                                                                                                                                                                                                                                                                                                                                                                               |                                                                                 |
| `name_overrides`    | list           | Names to show instead of the players' own, each an `entity` and the `name` to show for it                                                                                                                                                                                                                                                                                                                                                     | none                                                                            |
| `tap_action`        | object         | What tapping a player does, as for Home Assistant's own cards                                                                                                                                                                                                                                                                                                                                                                                 | `action: more-info`                                                             |
| `hold_action`       | object         | What holding a player does                                                                                                                                                                                                                                                                                                                                                                                                                    | none                                                                            |
| `double_tap_action` | object         | What a double tap does                                                                                                                                                                                                                                                                                                                                                                                                                        | none                                                                            |

A tap, hold or double tap acts on the player that was tapped, so the default opens that player's sensor.

## What it shows

Each player has their avatar, ringed in the colour of what they are doing. It is green in a game, blue online, red
busy, yellow away, dark blue snoozing, purple looking to play or trade and grey offline. Their Steam level sits in the corner of
the avatar.

- **In a game:** the game's icon and name, how long they have been playing it, and the game's picture behind them. The
  time is counted from when Home Assistant saw the game start, so after a restart of Home Assistant it starts again
  from zero.
- **Online, away and the rest:** the state, on one player's own card. In the list the group says it.
- **Offline:** greyed out, with the time they were last seen.

One player's own card has the game's wide picture behind them, darkened under the text, and the game's logo at the
right. A game without such a picture gets its smaller picture, dimmed. When a player is in no game, the Steam logo
stands in.

## Sizes

In a sections view the card is the section's full width by default, as tall as its contents, and can be made as
narrow as half the section. Below 400 px the list puts one player to a row, so names and games get the width. Below
360 px one player's own card leaves the game's logo out. Names and games wrap instead of being cut short.

## Examples

Every player there is:

```yaml
type: custom:steam-card-compact
auto_populate: true
```

A few players under names of your own, with a title:

```yaml
type: custom:steam-card-compact
title: Steam buddies
entity:
  - sensor.steam_matti
  - sensor.steam_liisa
name_overrides:
  - entity: sensor.steam_matti
    name: Matti
```

One player's own card, opening Steam's page for them on a tap:

```yaml
type: custom:steam-card-compact
entity: sensor.steam_matti
tap_action:
  action: url
  url_path: https://steamcommunity.com/id/matti-example
```

## Upgrading from 1.x

The card keeps its configuration, so nothing has to change. One named player still gets a card of their own, and a list
stays a list.

## Data

Everything comes from Home Assistant's Steam integration. For each player it creates a device with a sensor for their
state, and sensors for the game they are playing, their level and when they were last online, and pictures of the game.
The card finds them through the player's device, so it needs nothing but the player's own sensor.

On a Home Assistant from before those sensors and pictures, the card reads the same values from the player's sensor's
attributes. Those attributes go away in Home Assistant 2027.2, and by then the card has long stopped needing them.

The game's pictures and icon come from Steam through Home Assistant.

## Translating

The card's texts are in `src/localize/languages/`, one JSON file per language, named by its language code, such as
`en.json` and `fi.json`. To add a language, copy `en.json` to the new language's code, such as `sv.json`, and translate
the values. Nothing else needs changing. The card finds the file by itself and uses it when Home Assistant is set to
that language. A text left out falls back to English.

## Development

Requires Node 22.13 or newer.

```
npm install
npm run check
```

`npm run check` typechecks, lints, checks formatting, runs the tests and builds `dist/steam-card-compact.js`, which is
the file HACS installs and is committed to the repository.

| Path                        | What it contains                                                         |
| --------------------------- | ------------------------------------------------------------------------ |
| `src/steam-card-compact.ts` | The card itself and its layouts                                          |
| `src/friends.ts`            | Finding the players, reading them from their devices, grouping and times |
| `src/actions.ts`            | Telling a tap from a hold or a double tap                                |
| `src/editor.ts`             | The visual editor                                                        |
| `src/logo.ts`               | The Steam logo drawn behind a player in no game                          |
| `src/localize/languages/`   | The card's texts, one JSON file per language                             |
| `docs/screenshots.json`     | The made-up players the README's screenshots are taken from              |
| `docs/screenshots/`         | Their made-up avatars and games                                          |
| `tests/`                    | Tests, run with vitest                                                   |

## Support

Hey dude! Help me out for a couple of :beers: or a :coffee:!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/jesmak)

## Thanks

To [@Kibibit](https://github.com/Kibibit) for [kb-steam-card](https://github.com/Kibibit/kb-steam-card), which this
card started out from as a more compact take.

## License

MIT, see [LICENSE](LICENSE).

[releases-shield]: https://img.shields.io/github/release/jesmak/steam-card-compact.svg?style=for-the-badge
[release-date-shield]: https://img.shields.io/github/release-date/jesmak/steam-card-compact?style=for-the-badge
[releases]: https://github.com/jesmak/steam-card-compact/releases
[hacs-shield]: https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge
[hacs]: https://hacs.xyz/docs/faq/custom_repositories/
[license-shield]: https://img.shields.io/github/license/jesmak/steam-card-compact.svg?style=for-the-badge
