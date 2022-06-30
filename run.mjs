#!/usr/bin/env node
import Worky from './worky.mjs'
import minimist from 'minimist'
import 'dotenv/config'
import dayjs from 'dayjs'

function usage() {
  console.error(`Usage: node run.mjs ARGS
  ARGS:
    [--checkin [YYYY-MM-DD ]HH:mm] 
    [--randomize number] add/subtract a random amount of time
    [--checkout [YYYY-MM-DD ]HH:mm]

    If --checkin and --checkout dates only specify the time,
    the date will be set to today.

    For example: 
    run.mjs --checkin
    run.mjs --checkin 9:00 --checkout 17:00
    run.mjs --checkin '2022-02-22 9:00' --checkout '2022-02-22 17:00'
  `)
  process.exit(1)
}

var args = minimist(process.argv.slice(2));

const username = process.env.WORKY_USER
const password = process.env.WORKY_PASS

if (!username) {
  usage() 
}

const worky = new Worky()
try {
  await worky.login(username, password)

  if (args.checkin) {
    console.log(`Checking in`)
    await worky.checkin()
  }

  if (args.checkout) {
    console.log(`Checking out`)
    await worky.checkout()
  }
  process.exit(0)
} catch (errors) {
  console.error('ERROR', errors)
  process.exit(1)
}
