const child_process = require('child_process')
const dayjs = require('dayjs')

let today = dayjs()
today.$H = 8
today.$m = 59-Math.floor(Math.random()*30)
let entry_date = today.format("YYYY-MM-DD HH:mm")

today.$H = 17
today.$m = Math.floor(Math.random()*30)
let exit_date = today.format("YYYY-MM-DD HH:mm")
const username = process.argv[2]

child_process.fork("checkin.js", [username, entry_date, exit_date], {
  'stdio': [
    'inherit', 
    'inherit', 
    'inherit',
    'ipc'
  ]
})

