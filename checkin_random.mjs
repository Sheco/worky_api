#!/usr/bin/env node
import { fork } from 'child_process'

fork("run.mjs", [
  '--today',
  '--checkin', '9:00', 
  '--checkout', '17:00',
  '--random', '10',
])

