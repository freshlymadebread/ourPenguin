//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    lifeTime: 0,
    penguinName: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ani: false,
    showAni: false,
    logs:[{"id":1,"life":10,"nick_name":"轻罗小扇"},{"id":1,"life":10,"nick_name":"轻罗小扇"},{"id":1,"life":10,"nick_name":"轻罗小扇"},{"id":1,"life":20,"nick_name":"你是弟弟"},{"id":1,"life":2,"nick_name":"谁是弟弟"}],
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 喂养函数
  setFeedAni(){
    this.setData({
      ani: true 
    })
    let timer = setTimeout(() => {
      this.setData({
        ani: false 
      })
      clearTimeout(timer)
    }, 1000);
  },
  eat: function() {
    new Promise((resolve,reject) => {
      app.Request({
        url: `penguin/feed`,
        method: 'POST',
        success: res=>{
          console.log(res.data.data)
          if(res.data.data.code === 1){
            wx.showToast({
              title: '企鹅死了!',
              icon: 'none',
              duration: 2000//持续的时间
            })
            return
          }
          if(res.data.data.code === 2){
            wx.showToast({
              title: '点太快了，等一段时间后再喂养吧！',
              icon: 'none',
              duration: 2000//持续的时间
            })
            return
          }
          this.setFeedAni()
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000//持续的时间
          })
        }
      })
    })
  },
  onLoad: function () {
    let ws = wx.connectSocket({
      url: 'ws://47.100.98.138/v1/ws',
    })
    ws.onOpen(()=>{ console.log('链接成功res！') });
    ws.onMessage((res) => {
      let data = JSON.parse(res.data)
      this.setData({
        lifeTime: data.penguin_life,
        penguinName: 'lfl的企鹅',
      })
    })
    console.log(app.globalData)
    // 获取用户userid
    new Promise((resolve,reject) => {
      if (app.globalData.userInfo) {
        console.log('存在userinfo')
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
        resolve()
      } else if (this.data.canIUse){
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          resolve()
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
            resolve()
          }
        })
      }
    }).then(_=> {
      console.log(22222222222222222222222)
      console.log(this.data.userInfo.nickName)
      app.getToken()
    })
  },
  // 获取用户信息
  getUserInfo: function(e) {
    console.log('getUserInfo')
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function( options ){
    　　var that = this;
    　　var shareObj = {
    　　　　title: "一起养企鹅吧！",        // 默认是小程序的名称(可以写slogan等)
    　　　　path: '/pages/index/index',        // 默认是当前页面，必须是以‘/’开头的完整路径
    　　　　success: function(res){
    　　　　　　// 转发成功之后的回调
    　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
    　　　　　　}
    　　　　},
    　　　　fail: function(){
    　　　　　　// 转发失败之后的回调
    　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
    　　　　　　　　// 用户取消转发
    　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
    　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
    　　　　　　}
    　　　　},
    　　};
    　　// 来自页面内的按钮的转发
    　　if( options.from == 'button' ){
    　　　　var eData = options.target.dataset;
    　　　　console.log( eData.name );     // shareBtn
    　　　　// 此处可以修改 shareObj 中的内容
    　　　　shareObj.path = '/pages/btnname/btnname?btn_name='+eData.name;
    　　}
    　　// 返回shareObj
    　　return shareObj;
    }
})
