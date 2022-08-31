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

This script expects an .env file in the current directory, this file 
should contain the Worky credentials like this:

WORKY_USER=email@company
WORKY_PASS=plain_text_password

By default the authentication token is saved to a file called .token
in the current directory.
`)
  process.exit(1)
}

var args = minimist(process.argv.slice(2));

const commands = args._
const username = process.env.WORKY_USER
const password = process.env.WORKY_PASS
const tokenFile = process.env.TOKEN_FILE || ".token"

if (!username || commands.length == 0) {
  usage() 
}

async function login() {
  let token
  if (tokenFile) {
    try {
      token = await readFile(tokenFile, {encoding: 'utf8'})
    } catch(err) { }
  }
  let newtoken = await worky.loadOrLogin(token, username, password)
  if (tokenFile && token != newtoken) {
    await writeFile(tokenFile, newtoken)
  }
}

const worky = new Worky()
try {
  await login();
  
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
      let relative_checkin = checkin_date.fromNow()
      if (timework.can_check_next_shift && timework.can_check_next_shift) {
        console.log(`Checkin in: ${relative_checkin}`)
      } else if (timework.can_check_next_shift && timework.current_shift.start_time && !timework.record) {
        console.log(`Expected checkin: ${relative_checkin} (${timework.entry_tolerance} is ok)`)
      } else if (timework.current_shift.start_time && timework.record) {
        let minutesToCheckout = Math.round((checkout_date-dayjs())/60/1000)
        let relative_checkout = checkout_date.fromNow()
        if (minutesToCheckout > 0) {
          console.log(`Checkout in ${relative_checkout}`)
        } else {
          console.log(`Should have checked out ${relative_checkout}`)
        }

      } else {
        console.log(`'It looks you're good for now`)
      }

    }

    if (command === 'checkin') {
      console.log(`Checking in`)
      timework = await worky.checkin(timework)
      console.log('Ok')
    }

    if (command === 'checkout') {
      console.log(`Checking out`)
      timework = await worky.checkout(timework)
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
