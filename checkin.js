const process = require('process');
const fs = require("fs");
const dayjs = require('dayjs')

const Worky = require('./worky')

const username = process.argv[2]

if (username == undefined) {
  console.error("Error: no username specified")
  console.error("Usage: node checkin.js {username} < password.txt")
  process.exit(1)
}

let password
try {
  password = fs.readFileSync(0).toString().trim(); // STDIN_FILENO = 0
} catch (error) {
  console.error("Error: could not read the password from the standard input")
  console.error("Usage: node checkin.js {username} < password.txt")
  process.exit(1)
}

worky = new Worky()
worky.login(username, password).then(async () => {
  let today = dayjs()

  today.$H = 8
  today.$m = 59-Math.floor(Math.random()*30)
  let entry_date = today.format("YYYY-MM-DD HH:mm")
  await worky.checkin(entry_date)
  console.log('checkin: ', entry_date)

  today.$H = 17
  today.$m = Math.floor(Math.random()*30)
  let exit_date = today.format("YYYY-MM-DD HH:mm")
  await checkout(exit_date)
  console.log('checkout: ', exit_date)

})

