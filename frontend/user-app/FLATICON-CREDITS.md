# Category icons from Flaticon

These icons are used in the finished BOOK MY TICKETS app under the Flaticon free license with attribution. Source PNG files are not committed as a standalone icon collection. Docker builds download the selected public PNG assets and bundle them into the app. No subscription-only SVGs or account credentials are used.

License: https://www.flaticon.com/media/license/license.pdf

Visible creator attribution appears directly below the category rail. Do not remove it unless you hold an applicable attribution-free license.

| Category | Creator | Source |
| --- | --- | --- |
| all | Freepik / Magnific | https://www.flaticon.com/free-icon/ticket_7231275 |
| movie | Freepik / Magnific | https://www.flaticon.com/free-icon/popcorn_1511729 |
| music | Freepik / Magnific | https://www.flaticon.com/free-icon/microphone_4901086 |
| comedy | Freepik / Magnific | https://www.flaticon.com/free-icon/laughing_9985618 |
| play | Freepik / Magnific | https://www.flaticon.com/free-icon/theater_564153 |
| sports | Freepik / Magnific | https://www.flaticon.com/free-icon/trophy_123410 |
| workshop | Pop Vectors | https://www.flaticon.com/free-icon/color-palette_13433205 |
| exhibition | Freepik / Magnific | https://www.flaticon.com/free-icon/painting_2050958 |
| activity | Assia Benkerroum | https://www.flaticon.com/free-icon/hiking_8488382 |
| venue-rentals | Freepik / Magnific | https://www.flaticon.com/free-icon/building_1385180 |

`npm run prepare:icons` runs inside both standard Docker web and mobile build workflows. For other build workflows, run it before the Expo export. Files are stored under `assets/flaticon/`, excluded from Git. Builds fail clearly if an asset cannot be downloaded; they do not bypass access controls. A licensed local PNG at the matching path can be provided in the Docker build context as a cache. Native runtime requires no external icon CDN connection.
