import fetch from 'node-fetch'

/* Worky API 
 *
 * This exposes a helper API our Worky's public API allowing us to
 * 1) login
 * 2) get user information
 * 3) checkin
 * 4) checkout
 *
 * The checkin and checkout endpoints are our current goal, 
 * to run those, we need to get the JWT token and the employee id
 * to get the token, the login endpoint will gladly create it for us
 * to get the employee id, we need to ask for it to the me method
 * 
 */
export default class Worky {
  headers() {
    /* We are masquerading a Firefox browser */
    let headers = {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
          'Content-Type':'application/json',
    }

    // provide the token if we have it
    if (this.token !== undefined) {
          headers['Authorization'] = 'JWT ' + this.token
    }
    return headers
  }
  /*
   * The login method expects a user and a password
   * it returns a json response containing the token
   * on errors, it returns a json object with an error item
   *
   * We are also downloading the employer user information for
   * future us in the other api calls
   */
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
        this.user = await this.me()
        resolve()
      })
      .catch(response => reject(response))
    })
  }

  /* the me endpoint returns a json object with all of the user info
   * this includes the employee id and some other stuff
   *
   * on error, it returns an json object with an error item
   */
  async me() {
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


  /* the checkin endpoint expects the employee id in the URL
   *
   * In the POST data, it expects an `entry_date` item with the checkin date
   *
   * On success, it returns an empty string (just a newline)
   * On error, it returns a json object with an error item
   */
  async checkin(date) {
    return new Promise((resolve, reject) => {
      fetch(`https://api.worky.mx/api/v1/time_clock/web/${this.user.employee.id}/checkin/`, {
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
          return
        }
        resolve(response)
      })
      .catch(error => reject(error))
    })
  }

  /* the checkout endpoint expects the employee id in the URL
   *
   * In the POST data, it expects an `exit_date` item with the checkout date
   *
   * On success, it returns an empty string (just a newline)
   * On error, it returns a json object with an error item
   */
  async checkout(date) {
    return new Promise((resolve, reject) => {
      fetch(`https://api.worky.mx/api/v1/time_clock/web/${this.user.employee.id}/checkout/`, {
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
          return
        }
        resolve(response)
      })
      .catch(error => reject(error))
    })
  }
}
