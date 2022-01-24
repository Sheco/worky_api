import Worky from './worky.mjs'
import minimist from 'minimist'


function usage() {
  console.error("Usage: node checkin.js {username} {entry_date} {exit_date}")
  console.error("The password is read from the standard input, so you can either")
  console.error("type it or pipe it in like node checkin.js {args...} < password.txt")
  process.exit(1)
}

var args = minimist(process.argv.slice(2));

const username = args.user

if (exit_date == undefined) {
  console.error("Error: exit date undefined");
  usage()
}


if (username == undefined) {
  console.error("Error: no username specified")
  usage()
}

process.stdin.on('data', data => {
  // we're trimming the input so this means
  // users whose passwords start or end with 
  // spaces won't be able to use this tool for now
  // ¯\_(ツ)_/¯
  const password = data.toString().trim()
  const worky = new Worky()
  worky.login(username, password).then(async () => {
    if (args.checkin) {
      await worky.checkin(args.checkin)
      console.log(`Checking in at ${args.checkin}`)
    }

    if (args.checkout) {
      await worky.checkout(args.checkout)
      console.log(`Checking out at ${args.checkout}`)
    }
    process.exit(0)
  }).catch(errors => {
    console.error('ERROR', errors)
    process.exit(1)
  })
})

