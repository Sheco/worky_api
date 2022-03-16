#!/usr/bin/env node
import * as child_process from 'child_process'
import dayjs from 'dayjs'

let dateformat = 'YYYY-MM-DD HH:mm'
let entry_date = dayjs().hour(9).minute(0)
  .format(dateformat)
let exit_date = dayjs().hour(17).minute(0)
  .format(dateformat)

child_process.fork("run.mjs", [
  '--checkin', entry_date, 
  '--checkin_early',
  '--checkout', exit_date,
  '--checkout_late'
], {
  'stdio': [
    'inherit', 
    'inherit', 
    'inherit',
    'ipc'
  ]
})

