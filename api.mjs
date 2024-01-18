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
  constructor() {
    this.headers = {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
            'Content-Type':'application/json',
      }
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
    let response = await fetch("https://api.worky.mx/token/", {
      'method':'POST',
      'headers': this.headers,
      'body': JSON.stringify({'username': username, 'password': password})
    })

    if(!response.ok) {
      throw await response.text()
    }

    let json = await response.json()
    return this.startSession(json['token'])
  }

  async startSession(token) {
    this.headers['Authorization'] = 'JWT ' + token.trim()
    this.user = await this.me()
    return token
  }

  async loadOrLogin(token, username, password) {
    try {
      if (!token) throw 'Login instead'
      return await this.startSession(token)
    } catch (errors) {
      return await this.login(username, password)
    }
  }
  

  /* the me endpoint returns a json object with all of the user info
   * this includes the employee id and some other stuff
   *
   * on error, it returns an json object with an error item
   */
  async me() {
    let response = await fetch('https://api.worky.mx/api/v1/me/', {
      'headers': this.headers
    })

    if (!response.ok) {
      throw await response.text()
    }
    let json = await response.json()
    return json
  }

  async status_timework() {
    let response = await fetch('https://api.worky.mx/api/v1/status_timework/me/?timezone=America/Mexico_City', {
      'headers': this.headers
    })

    if (!response.ok) {
      throw await response.text()
    }
    let json = await response.json()
    return json
  }

  /* the checkin endpoint expects the employee id in the URL
   *
   * In the POST data, it expects an `entry_date` item with the checkin date
   *
   * On success, it returns an empty string
   * On error, it returns a json object with an error item
   */
  async checkin(timework) {
    // if we're early, we'll check-in using the next shift
    // but if we're late we have to check-in using the current shift
    let shift_id = timework.can_check_next_shift? 
      timework.next_shift.id: 
      timework.current_shift.id
    let response = await fetch(`https://api.worky.mx/api/v1/register/${shift_id}/checkin/`, {
      'method':'POST',
      'headers': this.headers,
      'body': JSON.stringify({
        'register_kind_start': 'web',
        'latitude_start': null,
        'longitude_start': null,
      })
    })

    if (!response.ok) {
      throw await response.text()
    }
    let json = await response.json()
    return json
  }

  /* the checkout endpoint expects the employee id in the URL
   *
   * In the POST data, it expects an `exit_date` item with the checkout date
   *
   * On success, it returns an empty string
   * On error, it returns a json object with an error item
   */
  async checkout(timework) {
    let shift_id = timework.current_shift.id
    let response = await fetch(`https://api.worky.mx/api/v1/register/${shift_id}/checkout/`, {
      'method':'POST',
      'headers': this.headers,
      'body': JSON.stringify({
        'register_kind_end': 'web',
        'latitude_end': null,
        'longitude_end': null,
      })
    })

    if (!response.ok) {
      throw response.text()
    }
    let json = await response.json()
    return json
  }

  async status(timework) {
      if(timework.is_day_off || timework.is_holiday || timework.is_pto_day || timework.is_vacation_day) {
        return 'off'
      } else if (timework.can_check_next_shift) {
        return 'early'
      } else if (timework.can_check_next_shift && timework.current_shift.start_time && !timework.record) {
        return 'tolerance'
      } else if(timework.current_shift.start_time && !timework.record) {
        return 'late'
      } else if (timework.current_shift.start_time && timework.record) {
        return 'working'
      } else if (!timework.can_check_next_shift) {
        return 'finished'
      } else {
        return 'unknown'
      }
  }

  action_available(status) {
    let actions = {
      off: 'none',
      early: 'checkin',
      tolerance: 'checkin',
      late: 'checkin',
      working: 'checkout',
      finished: 'none',
      unknown: 'none',
    }
    return actions[status]
  }
}
