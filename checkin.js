const process = require('process');
const fs = require("fs");

const Worky = require('./worky')

const username = process.argv[2]
const entry_date = process.argv[3]
const exit_date = process.argv[4]

if (exit_date == undefined) {
  console.error("Error: exit date undefined");
  usage()
}

function usage() {
  console.error("Usage: node checkin.js {username} {entry_date} {exit_date} < password.txt")
  process.exit(1)
}

if (username == undefined) {
  console.error("Error: no username specified")
  usage()
}

let password
try {
  password = fs.readFileSync(0).toString().trim();
} catch (error) {
  console.error("Error: could not read the password from the standard input")
  usage()
}


const worky = new Worky()
worky.login(username, password).then(async () => {
  await worky.checkin(entry_date)
  await worky.checkout(exit_date)
}).catch(errors => {
  console.error(errors)
  process.exit(1)
})

