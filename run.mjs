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
    [--tokenFile {filename}]
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
