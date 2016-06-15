# Thoughts App

## Installation

```bash
git clone git@github.com:rikukissa/thoughts-app.git
cd thoughts-app
npm install
npm start
open http://localhost:3000
```

## Mites testaaminen

Testit asuu samassa hakemistossa kun itse testattava juttu `tests` hakemiston alla.

`npm test` kun haluat ajaa testit läpi. `npm test -- --watch` kun haluat, että ne jää pyörimään ja ajautuu aina kun teet muutoksia koodiin.


## Mitäs kaikki nämä tiedostot on

```
├── README.md
├── deploy.sh - scripti, joka ajetaan automaattisesti aina kun pushataan masteriin
├── deploy_key.enc - scriptin käyttämä avain, jolla se pääsee lataamaan repon githubista
├── devServer.js - kehitysympäristön web-serveri, tarjoaa appsin selaimelle
├── index.html
├── package.json
├── src
│   ├── app.js
│   ├── components - React-komponenttien hakemisto
│   │   ├── hashtag.js
│   │   ├── notification - Unfinished todoista ilmoittava kello
│   │   │   ├── bell.svg
│   │   │   └── index.js
│   │   ├── text-input.js - Textarea ajatusten muokkaamiseen
│   │   └── thought.js
│   ├── index.js
│   ├── style.css
│   └── utils - Työkalut
│       ├── keys.js - Näppäimistö
│       ├── storage.js - Käyttäjän selaimeen tallentaminen
│       ├── thought.js - Ajatukset
│       └── walker.js - Meidän custom markdown setit
├── webpack.config.dev.js - Buildikonffi kehitykseen
└── webpack.config.prod.js - Buildikonffi tuotantoon

```

## Mites noi live-version ajatukset saa testailua varten omalla koneella pyörivään versioon?

![](https://i.imgur.com/vUgMONX.png)

Tuolta käyt live-versiossa kopsaamassa datan ja sit omassa versiossa pasteet samaan paikkaan
