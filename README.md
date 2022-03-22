## Proof of concept to programatically checkin/checkout on worky

This code is for educational purposes only.

The intention is to show how to checkin/checkout programatically, sending crafted entry and exit dates.

### Installation

Requirements: Nodejs 14

- Run `npm install`

### Usage

The run.mjs script's signature is:

```
nodejs run.mjs [--today] [--checkin entry_date] [--checkout exit_date]
--checkin: checkin date
--checkout: checkout date
--today: Add today date to --checkin and --checkout
--now: use current time
--randomize: add/subtract a random amount of time

If --today is not specified, --checkin and --checkout have to be full 
time (YYYY-MM-DD HH:mm), and the dates are expected as a single argument 
so make sure they're quoted.
If --today is specified, --checkin and --checkout only have to contain 
the time itself.
If --checkin or --checkout are "now", the current time will be used.
```

The login credentials are obtained from an `.env` file similar to this:
```
USER=someuser@company.com
PASS=somepass
```

Example run:

```
$ node run.mjs --checkin "2021-10-10 9:00" --checkout "2021-10-10 17:00"
$ node run.mjs --checkin now
$ node run.mjs --checkout now --randomize 10
$ node run.mjs --today --checkin 9:00 --checkout 17:00
$ node run.mjs --today --checkin 9:00 --checkout 17:00 --randomize 10
```

There's also a checkin_random.js script, which is a convenience script for checking in 
early and checking out late, both of these lines achieve the same goal.

```
$ node checkin_random.mjs
$ node run.mjs --today --randomize --checkin 9:00 --checkout 17:00
```
