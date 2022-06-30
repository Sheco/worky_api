## Proof of concept to programatically checkin/checkout on worky

This code is for educational purposes only.

The intention is to show how to checkin/checkout programatically, sending crafted entry and exit dates.

### Installation

Requirements: Nodejs 14

- Run `npm install`

### Usage

The run.mjs script's signature is:

```
nodejs run.mjs [--checkin] [--checkout]
--checkin: checkin now
--checkout: checkout now
```

The login credentials are obtained from an `.env` file similar to this:
```
USER=someuser@company.com
PASS=somepass
```

