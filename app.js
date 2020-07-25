//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    console.log('before login')
    let wxlogin = new Promise((resolved,reject) =>{
      wx.login({
        success: res => {
          this.globalData.code = res.code
          resolved()
        } 
      })
    })
    let getSetting = new Promise((resolved,reject) =>{
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                resolved()
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })
    })
    Promise.all([wxlogin, getSetting]).then(_=> {
      this.getToken()
    })
    this.Request
  },
  Request(options){
    console.log(this.globalData)
    return wx.request({
      ...options,
      url: 'http://47.100.98.138/v1/' + options.url + '?token=' + this.globalData.token + '&uid='+ this.globalData.uid,
      data: JSON.stringify({
        token: this.globalData.token,
        uid: this.globalData.uid
      })
    })
  },
  getToken(){
    wx.request({
      url: this.globalData.publishUrl + '/user/wechat_login',
      method: 'POST',
      header: {'content-type': 'application/json'},
      data: JSON.stringify({
        "code": this.globalData.code,
        "nick_name":  this.globalData.userInfo.nick_name 
      }),
      success: (res)=> {
        console.log(res)
        console.log(11111111111111111111111111111111111)
        let token = res.data.data.token
        this.globalData.token = token
        this.globalData.uid = res.data.data.uid
      }
    })
  },
  globalData: {
    userInfo: null,
    code: null,
    token: null,
    publishUrl: 'https://liufulin.xyz/v1/',
    uid: undefined,
  }
})