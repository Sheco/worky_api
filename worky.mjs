#!/usr/bin/env node
import Worky from './api.mjs'
import minimist from 'minimist'
import 'dotenv/config'
import { readFile, writeFile } from 'fs/promises'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

function usage() {
  console.error(`Usage: node worky.mjs ARGS
  ARGS:
    [report] Shows a status report
    [checkin] Executes a check-in
    [checkout] Executes a check-out
    [--tokenFile {filename}] file where the token is stored
  `)
  process.exit(1)
}

var args = minimist(process.argv.slice(2));

const commands = args._
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

  let timework = await worky.status_timework()
  while(commands.length > 0) {
    let command = commands.shift()

    if (command === 'timework') {
      console.log(timework)
    }

    if (command === 'report') {
      let checkin_date = dayjs(timework.next_shift.start_time, 'HH:mm:ss')
      let checkout_date = dayjs(timework.current_shift.end_time, "HH:mm:ss")
      if (timework.can_check_next_shift) {
        let relative = checkin_date.fromNow()
        console.log(`ETA Checkin: ${relative}`)
      } else if (timework.current_shift.start_time && !timework.record) {
        let relative = checkin_date.fromNow()
        console.log(`Expected checkin: ${relative} (${timework.entry_tolerance} is ok)`)
      } else if (timework.current_shift.start_time && timework.record) {
        let minutesToCheckout = Math.round((checkout_date-dayjs())/60/1000)
        if (minutesToCheckout > 0) {
          let relative = checkout_date.fromNow()
          console.log(`ETA Checkout: ${relative}`)
        } else {
          console.log('Checkout now')
        }

      } else {
        console.log(`'It looks you're good for now`)
      }

    }

    if (command === 'checkin') {
      console.log(`Checking in`)
      await worky.checkin(timework)
      console.log('Ok')
    }

    if (command === 'checkout') {
      console.log(`Checking out`)
      await worky.checkout(timework)
      console.log('Ok')
    }
  }
  process.exit(0)
} catch (errors) {
  console.error('ERROR', errors)
  for (let err of errors) {
    console.log(err)
  }
  process.exit(1)
}
