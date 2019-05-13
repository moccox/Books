//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //数据库建立连接
    wx.cloud.init({
      env: "sendbook-db-165e74",
      traceUser: true
    })
    // 登录
    var that = this
    wx.login({
      success: res => {
        that.globalData.infoFlag = true
        //获取用户名
        wx.getUserInfo({
          success(res) {
            that.globalData.userName = res.userInfo.nickName
          },
          fail(res) {
            console.log("app.js:获取用户名失败！", res)
          }
        })
        /**
         * 由于使用'='给globalData赋值太慢，
         * 导致上传数据到数据库时globalData中的userName依然为""，
         * 所以将在数据库创建个人信息的工作交给首页
         * */
      }
    })

    //获取openid
    wx.cloud.callFunction({
        name: 'getOpenid'
      })
      .then(res => {
        that.globalData.openid = res.result.openid
        console.log("openid:", that.globalData.openid)
      })
      .catch(console.error)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

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
  },
  globalData: {
    userInfo: null,
    infoFlag: false, //是否已经登录帐号
    userName: "", //用户名
    openid: "", //openid
    address: "", //用户取件、发件地址
    phoneNum:"",//联系方式
    locatedFlag: false, //是否已经获取定位
    latitude: 0.0, //记录定位纬度（浮点数）
    longitude: 0.0, //记录定位经度（浮点数）
    location: {
      province: "",
      city: "",
      district: ""
    } //记录地图定位
  },

  /**
   * 获取定位（经纬度）
   */
  getLatitudeLongitude: function() {
    let that = this
    let gData = this.globalData
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log('获取经纬度成功:' + JSON.stringify(res))
        gData.latitude = res.latitude
        gData.longitude = res.longitude
      },
      fail(res) {
        console.log('获取经纬度失败:' + JSON.stringify(res))
      }
    })
  },

  /*↓动画↓*/

  /**
   * 渐入渐出动画
   * （@页面指针，@实施动画对象，@透明度）
   */
  aM_gradient: function(that, param, opacity) {
    let animation = wx.createAnimation({ //创建动画
      duration: 1000,
      timingFunction: 'ease', //动画效果：开始缓慢中间加速最后缓慢结束
    });
    animation.opacity(opacity).step() //修改透明度，要求先在wxss将透明度设置<1，然后在此处改成1（不透明）
    //将param转换为key
    let json = '{"' + param + '":""}'
    json = JSON.parse(json); //将字符串json(字符串内容： {param:} param根据参数变化)转为JSON对象
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },

  /**
   * 向上滑动渐入渐出
   * （@页面指针，@实施动画对象，@向上偏移距离，@透明度）
   */
  aM_slideup: function(that, param, py, opacity) {
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    });
    animation.translateY(-py).opacity(opacity).step() //向下偏移-py（即向上偏移py）,修改透明度,要求先在wxss将组件偏移相反值，并且设置透明度<1，然后在此偏移回原位，透明度改成1（不透明）
    let json = '{"' + param + '":""}'
    json = JSON.parse(json)
    json[param] = animation.export()
    that.setData(json)
  },

  /**
   * 向右滑动渐入渐出
   * （@页面指针，@实施动画对象，@向右偏移距离，@透明度）
   */
  aM_slideright: function(that, param, px, opacity) {
    let animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease'
    });
    animation.translateX(px).opacity(opacity).step()
    let json = '{"' + param + '":""}'
    json = JSON.parse(json)
    json[param] = animation.export()
    that.setData(json)
  },

  /**
   * 缩放动画
   * (@页面指针,@实施动画对象,@持续时间，@X轴缩放倍数,@Y轴缩放倍速，@透明度)
   */
  aM_scale: function(that, param, time, sx, sy, opacity) {
    let a = param
    console.log(a)
    let animation = wx.createAnimation({
      duration: time,
      timingFunction: 'ease'
    })
    animation.scale(sx, sy).opacity(opacity).step() //X轴缩放sx倍，Y轴缩放sy倍，透明度改为opacity
    let json = '{"' + param + '":""}'
    json = JSON.parse(json)
    json[param] = animation.export()
    that.setData(json)
  }
})