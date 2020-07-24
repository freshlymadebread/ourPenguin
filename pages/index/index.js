//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    lifeTime: 0,
    penguinName: '',
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ani: null,
    showAni: false,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 喂养函数
  eat: function() {
    // this.setData({
    //   showAni: true,
    // })
    let life = Math.min(30000 , this.data.lifeTime + 1000)
    this.setData({
      lifeTime: life,
    })
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 0
    });
    animation.opacity(0.2).bottom('50%').step()
    this.setData({
      ani:  animation.export()
    })
    var returnAni = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
      delay: 0
    });
    returnAni.bottom('-50%').step()
    let timer = setTimeout(() => {
      clearTimeout(timer)
      this.setData({
        ani:  returnAni.export()
      })
    }, 1000);
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.getPenguinLife()
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.getPenguinLife()
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          this.getPenguinLife()
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 拉去企鹅信息函数
  getPenguinLife(){
    this.setData({
      lifeTime: 20000,
      penguinName: 'lfl的企鹅',
    })
    let timer = setInterval(_=>{
      let life = this.data.lifeTime - 100
      if(life < 0){
        clearInterval(timer)
      }
      else{
        this.setData({
          lifeTime: this.data.lifeTime - 100,
          penguinName: 'lfl的企鹅',
        })
      }
    },100)
  }
})
