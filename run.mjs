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

let dateformat = 'YYYY-MM-DD HH:mm'
let today = dayjs().format('YYYY-MM-DD ')
let now = dayjs().format('HH:mm')
let randomizeAmount = args.randomize===true? 10: args.randomize
let random = () => Math.floor(Math.random()*randomizeAmount)

const worky = new Worky()
try {
  await worky.login(username, password)
  if (args.checkin) {
    let date = args.checkin === true?
      today+now:
      (args.checkin.length<6? today: '') + args.checkin

    if (args.randomize) {
      date = dayjs(date)
        .subtract(random(), 'minute')
        .format(dateformat)
    }
    console.log(`Checking in at ${date}`)
    await worky.checkin(date)
  }

  if (args.checkout) {
    let date = args.checkout === true?
      today+now:
      (args.checkout.length<6? today: '') + args.checkout

    if (args.randomize) {
      date = dayjs(date)
        .add(random(), 'minute')
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
