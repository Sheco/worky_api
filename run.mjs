import { readFileSync } from 'fs';

import Worky from './worky.mjs'
import minimist from 'minimist'

function usage() {
  console.error("Usage: node checkin.js {--user username} {--checkin entry_date} {--checkout exit_date} {--passwordfile path}")
  process.exit(1)
}

var args = minimist(process.argv.slice(2));

const username = args.user
const passwordfile = args.passwordfile
const password = readFileSync(passwordfile, {encoding: 'utf8'})

const worky = new Worky()
try {
  await worky.login(username, password)
  if (args.checkin) {
    console.log(`Checking in at ${args.checkin}`)
    await worky.checkin(args.checkin)
  }

  if (args.checkout) {
    console.log(`Checking out at ${args.checkout}`)
    await worky.checkout(args.checkout)
  }
  process.exit(0)
} catch (errors) {
  console.error('ERROR', errors)
  process.exit(1)
}
