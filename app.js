//app.js
App({
  async onLaunch () {
    let login = this.wxAPI(wx.login)
    // 获取code
    let promiseLogin = login().then(res=>{
      wx.setStorageSync('code',res.code)
    },error=>{
    })
    // 获取用户信息
    let setting = await this.getSettingPromise()
    console.log('setting')
    console.log(setting)
    if(setting.authSetting['scope.userInfo']){
      let promiseGetUserInfo = this.getUserInfoPromise()
      Promise.all([promiseGetUserInfo, promiseLogin]).then(_=> {
        this.getToken()
      })
    }
  },
  Request(options){
    return wx.request({
      ...options,
      url: 'http://47.100.98.138/v1/' + options.url + '?token=' + this.globalData.token + '&uid='+ this.globalData.uid,
      data: JSON.stringify({
        token: this.globalData.token,
        uid: this.globalData.uid
      })
    })
  },
  getSettingPromise(){
    let {log} = console
    let getSetting = this.wxAPI(wx.getSetting)
    let getUserInfo = this.wxAPI(wx.getUserInfo)
    return getSetting().then(res=>{
      log(res)
      return res
    })
  },
  getUserInfoPromise(){
    let getUserInfo = this.wxAPI(wx.getUserInfo)
    getUserInfo().then(resp => {
      console.log(resp)
      wx.setStorageSync('userInfo', resp.userInfo)
      if (this.userInfoReadyCallback) {
        this.userInfoReadyCallback(resp)
      }
    })
  },
  getToken(){
    console.log(this.globalData.getTokenRequest)
    if(this.globalData.getTokenRequest){
      return this.globalData.getTokenRequest
    }
    this.globalData.getTokenRequest = wx.request({
      url: this.globalData.publishUrl + '/user/wechat_login',
      method: 'POST',
      header: {'content-type': 'application/json'},
      data: JSON.stringify({
        "code": wx.getStorageSync('code'),
        "nick_name":  wx.getStorageSync('userInfo').nick_name,
      }),
      success: (res)=> {
        let token = res.data.data.token
        this.globalData.getTokenRequest = undefined
        this.globalData.token = token
        this.globalData.uid = res.data.data.uid
      }
    })
    return this.globalData.getTokenRequest
  },
  wxAPI(api){
    return (conf)=> (new Promise((resolved,reject) => {
      api({
        ...conf,
        success: resolved,
        fail: reject
      })
    }))
  },
  globalData: {
    userInfo: null,
    code: null,
    token: null,
    publishUrl: 'https://liufulin.xyz/v1/',
    uid: undefined,
    getTokenRequest: undefined,
  }
})