#!/usr/bin/env node
import Worky from './worky.mjs'
import minimist from 'minimist'
import 'dotenv/config'
import dayjs from 'dayjs'

function usage() {
  console.error("Usage: node run.mjs [--checkin entry_date] [--checkout exit_date]")
  process.exit(1)
}

var args = minimist(process.argv.slice(2));

const username = process.env.WORKY_USER
const password = process.env.WORKY_PASS

if (!username) {
  usage() 
}

let dateformat = 'YYYY-MM-DD HH:mm'
const worky = new Worky()
try {
  await worky.login(username, password)
  if (args.checkin) {
    let date = args.checkin

    if (args.checkin_early) {
      date = dayjs(date)
        .subtract(Math.random()*30, 'minute')
        .format(dateformat)
    }
    console.log(`Checking in at ${date}`)
    await worky.checkin(date)
  }

  if (args.checkout) {
    let date = args.checkout
    if (args.checkout_late) {
      date = dayjs(date)
        .add(Math.random()*30, 'minute')
        .format(dateformat)
    }
    console.log(`Checking out at ${date}`)
    await worky.checkout(date)
  }
  process.exit(0)
} catch (errors) {
  console.error('ERROR', errors)
  process.exit(1)
}
