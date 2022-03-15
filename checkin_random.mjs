#!/usr/bin/env node
import * as child_process from 'child_process'
import dayjs from 'dayjs'

let dateformat = 'YYYY-MM-DD HH:mm'

let entry_date = dayjs().hour(9).minute(0)
  .subtract(Math.random()*30, 'minute')
  .format(dateformat)

let exit_date = dayjs().hour(17).minute(0)
  .add(Math.random()*30, 'minute')
  .format(dateformat)

child_process.fork("run.mjs", [
  '--checkin', entry_date, 
  '--checkout', exit_date], {
  'stdio': [
    'inherit', 
    'inherit', 
    'inherit',
    'ipc'
  ]
})

