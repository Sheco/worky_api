import Worky from './worky.mjs'

function usage() {
  console.error("Usage: node checkin.js {username} {entry_date} {exit_date}")
  console.error("The password is read from the standard input, so you can either")
  console.error("type it or pipe it in like node checkin.js {args...} < password.txt")
  process.exit(1)
}

const username = process.argv[2]
const entry_date = process.argv[3]
const exit_date = process.argv[4]

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
    let response
    response = await worky.checkin(entry_date)
    console.log(`Checking in at ${entry_date}, Response: ${response}`)
    response = await worky.checkout(exit_date)
    console.log(`Checking out at ${exit_date}, Response: ${response}`)
    process.exit(0)
  }).catch(errors => {
    console.error('ERROR', errors)
    process.exit(1)
  })
})

