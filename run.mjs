#!/usr/bin/env node
import Worky from './worky.mjs'
import minimist from 'minimist'
import 'dotenv/config'
import dayjs from 'dayjs'

function usage() {
  console.error(`Usage: node run.mjs ARGS
  ARGS:
    [--checkin] 
    [--checkout]
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
