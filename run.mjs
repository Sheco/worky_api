#!/usr/bin/env node
import Worky from './worky.mjs'
import minimist from 'minimist'
import 'dotenv/config'
import dayjs from 'dayjs'

function usage() {
  console.error(`Usage: node run.mjs ARGS
  ARGS:
    [--today] Adds today's date to the checkin and checkout times
    [--checkin entry_date] 
    [--checkin_early] subtract some random time to the checkin
    [--checkout exit_date]
    [--checkout_late] adds some random time to the checkout

    If --today is not specified the --checkin and --checkout dates
    are absolute (YYYY-MM-DD HH:mm)

    For example: 
    run.mjs --today --checkin 9:00 --checkout 17:00

    Otherwise, --checkin and --checkout should only specify the time

    For example:
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

let dateformat = 'YYYY-MM-DD HH:mm'
let today = dayjs().format('YYYY-MM-DD ')

const worky = new Worky()
try {
  await worky.login(username, password)
  if (args.checkin) {
    let date = (args.today? today: '') + args.checkin

    if (args.checkin_early) {
      date = dayjs(date)
        .subtract(Math.random()*30, 'minute')
        .format(dateformat)
    }
    console.log(`Checking in at ${date}`)
    await worky.checkin(date)
  }

  if (args.checkout) {
    let date = (args.today? today: '') + args.checkout
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
