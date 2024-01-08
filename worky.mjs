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

    if (command === 'status') {
      let status = await worky.status(timework)
      if(status=='unknown') console.log(timework)
      let action_needed = worky.action_needed(status)
      console.log('status:', status)
      console.log('action needed', action_needed)
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
/*  for (let err of errors) {
    console.log(err)
  }*/
  process.exit(1)
}
