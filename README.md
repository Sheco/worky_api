## API to connect and interact with Worky

This code is for educational purposes only.

Currently the only supported actions are login, checkin and checkout.

There is an extra `report` action that fetches the time work information and outputs a simple report of what needs to be done, for example: estimated time before the checkin deadline and how long more you have to continue working.

### Installation

Requirements: Nodejs 14

- Run `npm install`

### Usage

The run.mjs script's signature is:

```
nodejs run.mjs COMMANDS
commands:
  checkin: checkin now
  checkout: checkout now
  report: quick status report
  [--tokenFile {path}] path for the authentication token file.
```

The login credentials are obtained from an `.env` file similar to this:
```
WORKY_USER=someuser@company.com
WORKY_PASS=somepass
```

