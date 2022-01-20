import fetch from 'node-fetch'

export default class Worky {
  headers() {
    let headers = {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
          'Content-Type':'application/json',
    }
    if (this.token !== undefined) {
          headers['Authorization'] = 'JWT ' + this.token
    }
    return headers
  }
  async login(username, password) {
    return new Promise((resolve, reject) => {
      fetch("https://api.worky.mx/token/", {
        'method':'POST',
        'headers': this.headers(),
        'body': JSON.stringify({'username': username, 'password': password})
      })
      .then(response => response.json())
      .then(async response => {
        if(response['errors'] !== undefined) {
          reject(response['errors'])
          return
        }
        this.token = response['token']
        this.me = await this.fetchme()
        resolve()
      })
      .catch(response => reject(response))
    })
  }

  async fetchme() {
    return new Promise((resolve, reject) => {
      fetch('https://api.worky.mx/api/v1/me/', {
        'headers': this.headers()
      })
      .then(response => response.json())
      .then(response => {
        if(response['errors'] !== undefined) {
          reject(response['errors'])
          return
        }
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
      
    })
  }


  async checkin(date) {
    return new Promise((resolve, reject) => {
      fetch(`https://api.worky.mx/api/v1/time_clock/web/${this.me.employee.id}/checkin/`, {
        'method':'POST',
        'headers': this.headers(),
        'body': JSON.stringify({'entry_date': date})
      })
      .then(response => response.text())
      .then(response => response.trim())
      .then(response => {
        if (response !== "") {
          response = JSON.parse(response)
          reject(response.errors)
        }
      })
      .catch(error => reject(error))
    })
  }

  async checkout(date) {
    return new Promise((resolve, reject) => {
      fetch(`https://api.worky.mx/api/v1/time_clock/web/${this.me.employee.id}/checkout/`, {
        'method':'POST',
        'headers': this.headers(),
        'body': JSON.stringify({'exit_date': date})
      })
      .then(response => response.text())
      .then(response => response.trim())
      .then(response => {
        if (response !== "") {
          response = JSON.parse(response)
          reject(response.errors)
        }
      })
      .catch(error => reject(error))
    })
  }
}
