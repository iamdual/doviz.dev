# [Doviz.dev API](https://github.com/iamdual/doviz.dev)

[![Deploy Doviz.dev to GitHub Pages](https://github.com/iamdual/doviz.dev/actions/workflows/doviz.dev.yml/badge.svg)](https://github.com/iamdual/doviz.dev/actions/workflows/doviz.dev.yml)

This repository provides an exchange rate API via GitHub Pages. All exchange rates are obtained from open sources (like central banks).

# Usage

```
curl https://doviz.dev/v1/{currency_code}.json
```

The currency code must be lowercase. Supported currencies are listed below.

### Example response:

```json
{
  "USDTRY": 23.7169,
  "TRYUSD": 0.04216402649587425,
  "AUDTRY": 16.4238,
  "TRYAUD": 0.060887248992316026,
  "EURTRY": 25.9662,
  "TRYEUR": 0.03851160354614845,
  "GBPTRY": 30.4036,
  "TRYGBP": 0.03289084187398861,
  "CHFTRY": 26.6672,
  "TRYCHF": 0.0374992500149997,
  "JPYTRY": 0.168983,
  "TRYJPY": 5.917755040447856,
  "_meta": {
    "base": "TRY",
    "source": "tcmb.gov.tr",
    "generated_at": "2023-06-18T16:24:03.281Z",
    "updated_at": "2023-06-16T12:30:00.000Z"
  }
}
```

# Supported currencies

| Code | Source            | API Link                      |
| ---- | ----------------- | ----------------------------- |
| USD  | floatrates.com    | https://doviz.dev/v1/usd.json |
| EUR  | ecb.europa.eu     | https://doviz.dev/v1/eur.json |
| TRY  | tcmb.gov.tr       | https://doviz.dev/v1/try.json |
| AUD  | rba.gov.au        | https://doviz.dev/v1/aud.json |
| DKK  | nationalbanken.dk | https://doviz.dev/v1/dkk.json |
| CAD  | bankofcanada.ca   | https://doviz.dev/v1/cad.json |
| PLN  | nbp.pl            | https://doviz.dev/v1/pln.json |
| BTC  | binance.com       | https://doviz.dev/v1/btc.json |

# F.A.Q.

- **Is it free to use?**

  > Yes. This is an open source project and everyone can access it for free.

- **Is there any limit?**

  > It depends on GitHub. Currently GitHub Pages imposes a soft bandwidth limit of 100GB monthly, [GitHub says](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages). So, please cache the response and use sparingly.

- **How often is it updated?**

  > It depends on the sources. Exchange rates are usually updated daily for central banks. But we fetch data and generate JSON files every 10 minutes.

- **Why would we need this?**

  > Doviz.dev converts data with varying structures from different sources into a standard format.

- **What "doviz" means?**

  > "Döviz" (dö·viz) is a Turkish word means "foreign currency".

- **Which sources using?**
  > We use several open sources to obtain exchange rates. Some sources we use are listed [here](https://github.com/iamdual/doviz.dev/blob/master/SOURCES.md).

# Contributing

Please feel free to create pull request or [create an issue](https://github.com/iamdual/doviz.dev/issues).

# License

Apache License 2.0 - [Ekin Karadeniz](https://github.com/iamdual) ©2024
