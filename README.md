## Proof of concept to programatically checkin/checkout on worky

This code is for educational purposes only.

The intention is to show how to checkin/checkout programatically, sending crafted entry and exit dates.

### Installation

Requirements: Nodejs 14

- Run `npm install`

### Usage

The run.mjs script's signature is:

```
nodejs run.mjs [--checkin entry_date] [--checkout exit_date]
checkin: full checkin date (YYYY-MM-DD HH:mm) 
checkout: full checkout date (YYYY-MM-DD HH:mm)

The dates are expected as a single variable so make sure they're quoted.
```

The login credentials are obtained from an `.env` file similar to this:
```
USER=someuser@company.com
PASS=somepass
```

Example run:

```
$ node run.mjs  --checkin "2021-10-10 9:00" --checkout "2021-10-10 17:00"
```

There's also a checkin_random.js script, which is a convenience script to checkin and out with randomized times (30 minutes before 9am and 30 minutes after 5pm). 

```
$ node checkin_random.mjs
```
