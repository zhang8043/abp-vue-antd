export default {
  initialUrl: location.href,
  getQueryParameters () {
    return this.getQueryParametersUsingParameters(document.location.search)
  },
  getQueryParametersUsingParameters (search) {
    return search.replace(/(^\?)/, '').split('&').map(function (n) { return n = n.split('='), this[n[0]] = n[1], this }.bind({}))[0]
  },
  getQueryParametersUsingHash () {
    return document.location.hash.substr(1, document.location.hash.length - 1).replace(/(^\?)/, '').split('&').map(function (n) { return n = n.split('='), this[n[0]] = n[1], this }.bind({}))[0]
  },
  getInitialUrlParameters () {
    const questionMarkIndex = this.initialUrl.indexOf('?')
    if (questionMarkIndex >= 0) {
      return this.initialUrl.substr(questionMarkIndex, this.initialUrl.length - questionMarkIndex)
    }
    return ''
  },
  getReturnUrl () {
    const queryStringObj = this.getQueryParametersUsingParameters(this.getInitialUrlParameters())
    if (queryStringObj.returnUrl) {
      return decodeURIComponent(queryStringObj.returnUrl)
    }
    return null
  },
  getSingleSignIn () {
    const queryStringObj = this.getQueryParametersUsingParameters(this.getInitialUrlParameters())
    if (queryStringObj.ss) {
      return queryStringObj.ss
    }
    return false
  },
  isInstallUrl (url) {
    return url && url.indexOf('app/admin/install') >= 0
  }
}