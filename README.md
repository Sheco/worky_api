## Proof of concept to programatically checkin/checkout on worky

This code is for educational purposes only.

The intention is to show how to checkin/checkout programatically, sending crafted entry and exit dates.

### Installation

Requirements: node 14

This package uses ES modules, available in nodejs 14, to run this in nodejs 12, you have to add `--experimental-modules` to nodejs's arguments in the command line.

- Run `npm install`

### Usage

The checkin script's signature is:

```
nodejs checkin.js {username} {entry_date} {exit_date}
username: email address for your Worky account
entry_date: full checkin date (YYYY-MM-DD HH:mm) 
exit_date: full checkout date (YYYY-MM-DD HH:mm)

The dates are expected as a single variable so make sure they're quoted.
The script expects the password on the standard input, it's recommended to pipe it in.
```

For example:

```
$ nodejs checkin.js user@email.com "2021-10-10 9:00" "2021-10-10 17:00" < password.txt
```

There's also a checkin_random.js script, which is a convenience script to checkin and out with randomized times (30 minutes before 9am and 30 minutes after 5pm)

```
$ nodejs checkin_random.js user@mail.com < password.txt
```
