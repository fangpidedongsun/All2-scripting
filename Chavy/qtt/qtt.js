const cookieName = '趣头条'
const signurlKey = 'senku_signurl_qtt'
const signheaderKey = 'senku_signheader_qtt'
const signbodyKey = 'senku_signbody_qtt'
const senku = init()
const signurlVal = senku.getdata(signurlKey)
const signheaderVal = senku.getdata(signheaderKey)

sign()

function sign() {

  const url = { url: signurlVal, headers: JSON.parse(signheaderVal) }
  senku.get(url, (error, response, data) => {
    const result = JSON.parse(data)
    let subTitle = ``
    let detail = ``
    const code = result.code
    const message = result.message
    if (code == 0) {
      const amount = result.data.amount
      const continuouSignIn = result.data.continuouSignIn
      subTitle = `签到结果: 成功`
      detail = `获得${amount}💰连续签到天数:${continuouSignIn}天`
    } else if (code == -132) {
      subTitle = `${message}`
    }
    else {
      subTitle = `签到结果: 失败`
    }
    senku.msg(cookieName, subTitle, detail)
    senku.done()
  })
}


function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
