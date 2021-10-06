## Proof of concept to programatically checkin/checkout of worky

This code is for educational purposes only.

The intention is to show how to checkin/checkout programatically, sending crafted entry and exit dates.

### Installation

Requirements: node 12

- Run `npm install`
- Edit the config.json file, using your worky credentials


### Usage

Just run `node client.js`, at any given time of the day, it will send a both checkin and checkout requests to worky at 9:00am and 5:00pm respectively.
