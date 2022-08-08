#!/usr/bin/env node
import Worky from './worky.mjs'
import minimist from 'minimist'
import 'dotenv/config'
import { readFile, writeFile } from 'fs/promises'
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
const tokenFile = process.env.TOKEN_FILE

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

  await worky.login(username, password)

  if (args.timework) {
    console.log(worky.timework)
  }

  if (args.checkin) {
    console.log(`Checking in`)
    let response = await worky.checkin()
    console.log(response)
  }

  if (args.checkout) {
    console.log(`Checking out`)
    let response = await worky.checkout()
    console.log(response)
  }
  process.exit(0)
} catch (errors) {
  console.error('ERROR', errors)
  process.exit(1)
}
