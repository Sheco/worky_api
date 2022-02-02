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
  console.error("Usage: node checkin_random.js {username}")
  console.error("The password is read from the standard input, so you can either")
  console.error("type it or pipe it in like node checkin_random.js {username} < password.txt")
  process.exit(1)
}
const username = process.argv[2]
if (username == undefined) {
  usage()
}

child_process.fork("run.mjs", ['--user', username, '--checkin', entry_date, '--checkout', exit_date, '--passwordfile', 'password.txt'], {
  'stdio': [
    'inherit', 
    'inherit', 
    'inherit',
    'ipc'
  ]
})

