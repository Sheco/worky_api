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
--randomize: add/subtract a random amount of time

If --checkin and --checkout dates only specify the time, the date will be set to today.
The dates are expected as a single argument so make sure they're quoted.
the time itself.
If --checkin or --checkout don't have an argument, the current time will be used.
```

The login credentials are obtained from an `.env` file similar to this:
```
USER=someuser@company.com
PASS=somepass
```

Example run:

```
# to check-in and out at specific dates
$ node run.mjs --checkin "2021-10-10 9:00" --checkout "2021-10-10 17:00"
# to check-in right now
$ node run.mjs --checkin
# to checkout now, but add some random minutes.
$ node run.mjs --checkout --randomize 10
# to checkin today at 9am and checkout at 5pm
$ node run.mjs --checkin 9:00 --checkout 17:00
# to checkin today at 9am and checkout at 5pm but subtract/add some minutes
$ node run.mjs --checkin 9:00 --checkout 17:00 --randomize 10
```

There's also a checkin_random.js script, which is a convenience script for checking in 
early and checking out late, both of these lines achieve the same goal.

```
$ node checkin_random.mjs
$ node run.mjs --today --randomize --checkin 9:00 --checkout 17:00
```
