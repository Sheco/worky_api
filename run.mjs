#!/usr/bin/env node
import Worky from './worky.mjs'
import minimist from 'minimist'
import 'dotenv/config'
import { readFile, writeFile } from 'fs/promises'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
dayjs.extend(customParseFormat)

function usage() {
  console.error(`Usage: node run.mjs ARGS
  ARGS:
    [--checkin] 
    [--checkout]
    [--tokenFile {filename}]
    [--report] Shows a status report
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
    if (tw.can_check_next_shift) {
      let checkin_date = dayjs(tw.next_shift.start_time, 'HH:mm:ss')
      let minutesToCheckin = Math.round((checkin_date-dayjs())/60/1000)
      console.log(`You need to checkin in less than ${minutesToCheckin} minutes`)
    }

    if (tw.current_shift.start_time) {
      let checkout_date = dayjs(tw.current_shift.end_time, "HH:mm:ss")
      let minutesToCheckout = Math.round((checkout_date-dayjs())/60/1000)
      let hours = Math.floor(minutesToCheckout/60)
      let mins = minutesToCheckout%60
      console.log(`You still have to work ${hours} hours and ${mins} minutes`)

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
