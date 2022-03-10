import * as child_process from 'child_process'
import dayjs from 'dayjs'

let today = dayjs()
today.$H = 8
today.$m = 59-Math.floor(Math.random()*30)
let entry_date = today.format("YYYY-MM-DD HH:mm")

today.$H = 17
today.$m = Math.floor(Math.random()*30)
let exit_date = today.format("YYYY-MM-DD HH:mm")
function usage() {
  console.error(`Usage: node checkin_random.js
The credentials are read from the .env file, for example:
USER=someuser@company.com
PASS=somepass
  `)
  process.exit(1)
}

child_process.fork("run.mjs", [
  '--envconfig', 
  '--checkin', entry_date, 
  '--checkout', exit_date], {
  'stdio': [
    'inherit', 
    'inherit', 
    'inherit',
    'ipc'
  ]
})

