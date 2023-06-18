# [Doviz.dev API](https://github.com/iamdual/doviz.dev)

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
    "created_at": "2023-06-18T12:47:49.491Z"
  }
}
```

# Supported currencies

| Currency | Link                          |
|----------|-------------------------------|
| USD      | https://doviz.dev/v1/usd.json |
| EUR      | https://doviz.dev/v1/eur.json |
| TRY      | https://doviz.dev/v1/try.json |

# F.A.Q.
- What "`doviz`" means?
> "Döviz" (dö·viz) is a Turkish word means "currency".

- Is it free?
> Yes. This is an open source project and everyone can access for free.

- Is there any limit?
> It depends to GitHub. Currently GitHub Pages bandwidth limit is 100GB monthly, [GitHub says](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages). So, please cache the response and use sparingly. Otherwise the service may be suspended.

- Which sources using?
> We use several open sources to obtain exchange rates. Some sources we use are listed [here](https://github.com/iamdual/doviz.dev/blob/master/SOURCES.md).

# Contributing
Please feel free to create pull request or [create an issue](https://github.com/iamdual/doviz.dev/issues).
