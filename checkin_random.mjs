#!/usr/bin/env node
import { fork } from 'child_process'

fork("run.mjs", [
  '--today',
  '--checkin', '9:00', 
  '--checkin_early',
  '--checkout', '17:00',
  '--checkout_late'
])

