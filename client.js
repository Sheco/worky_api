const fs = require('fs')
const fetch = require('node-fetch')
const dayjs = require('dayjs')

const urls = {
  'checkin': "https://api.worky.mx/api/v1/time_clock/web/71c76b80-867e-4c09-b890-8d7aec118fbc/checkin/",
  'checkout': "https://api.worky.mx/api/v1/time_clock/web/71c76b80-867e-4c09-b890-8d7aec118fbc/checkout/",
  'login': "https://api.worky.mx/token/"
}

function login(username, password) {
  return new Promise((resolve, reject) => {
    fetch(urls.login, {
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

function checkin(token, date) {
  return new Promise((resolve, reject) => {
    fetch(urls.checkin, {
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

function checkout(token, date) {
  return new Promise((resolve, reject) => {
    fetch(urls.checkout, {
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
  let today = dayjs().format("YYYY-MM-DD")
  let success = await checkin(response.token, today+' 09:00')
  console.log('checkin: ', success)

  success = await checkout(response.token, today+' 17:00')
  console.log('checkout: ', success)

})
