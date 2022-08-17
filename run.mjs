#!/usr/bin/env node
import Worky from './worky.mjs'
import minimist from 'minimist'
import 'dotenv/config'
import { readFile, writeFile } from 'fs/promises'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

function usage() {
  console.error(`Usage: node run.mjs ARGS
  ARGS:
    [--report] Shows a status report
    [--checkin] Executes a check-in
    [--checkout] Executes a check-out
    [--tokenFile {filename}] file where the token is stored
  `)
  process.exit(1)
}

var args = minimist(process.argv.slice(2));

const username = process.env.WORKY_USER
const password = process.env.WORKY_PASS
const tokenFile = process.env.TOKEN_FILE || ".token"

if (!username) {
  usage() 
}

const worky = new Worky()
try {
  let token;
  
  if (tokenFile) {
    try {
      token = await readFile(tokenFile, {encoding: 'utf8'})
    } catch(err) { }
  }
  token = await worky.loadOrLogin(token, username, password)
  await writeFile(tokenFile, token)

  if (args.timework) {
    console.log(await worky.status_timework())
  }

  if (args.report) {
    let tw = await worky.status_timework()
    let checkin_date = dayjs(tw.next_shift.start_time, 'HH:mm:ss')
    let checkout_date = dayjs(tw.current_shift.end_time, "HH:mm:ss")
    if (tw.can_check_next_shift) {
      let relative = checkin_date.fromNow()
      console.log(`ETA Checkin: ${relative}`)
    } else if (tw.current_shift.start_time && !tw.record) {
      let relative = checkin_date.fromNow()
      console.log(`Expected checkin: ${relative} (${tw.entry_tolerance} is ok)`)
    }

    if (tw.current_shift.start_time && tw.record) {
      let minutesToCheckout = Math.round((checkout_date-dayjs())/60/1000)
      if (minutesToCheckout > 0) {
        let relative = checkout_date.fromNow()
        console.log(`ETA Checkout: ${relative}`)
      } else {
        console.log('Checkout now')
      }

    }
  }

  if (args.checkin) {
    console.log(`Checking in`)
    let timework = await worky.status_timework()
    let response = await worky.checkin(timework)
    console.log(response)
  }

  if (args.checkout) {
    console.log(`Checking out`)
    let timework = await worky.status_timework()
    let response = await worky.checkout(timework)
    console.log(response)
  }
  process.exit(0)
} catch (errors) {
  console.error('ERROR', errors)
  for (let err of errors) {
    console.log(err)
  }
  process.exit(1)
}
