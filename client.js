const fs = require('fs')
const fetch = require('node-fetch')
const dayjs = require('dayjs')

function login(username, password) {
  return new Promise((resolve, reject) => {
    fetch("https://api.worky.mx/token/", {
      'method':'POST',
      'headers': {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
        'Content-Type':'application/json',
      },
      'body': JSON.stringify({'username': username, 'password': password})
    })
    .then(data => data.json())
    .then(data => resolve(data))
    .catch(error => reject(error))
  })
}

function me(token) {
  return new Promise((resolve, reject) => {
    fetch('https://api.worky.mx/api/v1/me/', {
      'headers': {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
        'Content-Type':'application/json',
        'Authorization':'JWT '+token,
      },
    })
    .then(data => data.json())
    .then(data => resolve(data))
    .catch(error => {
      reject(error)
    })
    
  })
}

function checkin(token, employee_id, date) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.worky.mx/api/v1/time_clock/web/${employee_id}/checkin/`, {
      'method':'POST',
      'headers': {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
        'Content-Type':'application/json',
        'Authorization':'JWT '+token,
      },
      'body': JSON.stringify({'entry_date': date})
    })
      .then(data => data.text())
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

function checkout(token, employee_id, date) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.worky.mx/api/v1/time_clock/web/${employee_id}/checkout/`, {
      'method':'POST',
      'headers': {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
        'Content-Type':'application/json',
        'Authorization':'JWT '+token
      },
      'body': JSON.stringify({'exit_date': date})
    })
      .then(data => data.text())
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

const config = JSON.parse(
  fs.readFileSync('config.json', {encoding:'utf8', flag:'r'})
)

login(config.username, config.password).then(async response => {
  let info = await me(response.token)
  let employee_id = info.employee.id
  let today = dayjs().format("YYYY-MM-DD")
  let success = await checkin(response.token, employee_id, today+' 09:00')
  console.log('checkin: ', success)

  success = await checkout(response.token, employee_id, today+' 17:00')
  console.log('checkout: ', success)

})
