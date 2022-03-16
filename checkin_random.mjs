#!/usr/bin/env node
import * as child_process from 'child_process'

child_process.fork("run.mjs", [
  '--today',
  '--checkin', '9:00', 
  '--checkin_early',
  '--checkout', '17:00',
  '--checkout_late'
], {
  'stdio': [
    'inherit', 
    'inherit', 
    'inherit',
    'ipc'
  ]
})

