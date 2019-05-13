// pages/person/person.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personalFlag: false,
    integralFlag: false,
    hasInfoFlag: false,
    integral: 0,
    userName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 展开/收起个人信息子列表
   * 通过改变personalFlag改变css实现
   */
  changePsFlag: function() {
    this.setData({
      personalFlag: !this.data.personalFlag
    })
  },

  /**
   * 显示爱心值
   */
  showLove: function() {
    //从数据库获取爱心值，赋值给integral
    var that = this //先固定this指针，否则从数据库取完数据会失去this指针的方向
    const db = wx.cloud.database({
      env: 'sendbook-db-165e74'
    })
    db.collection('userMessages').where({
      _openid: getApp().globalData.openid
    }).get({
      success(res) {
        //console.log(res.data)
        that.setData({
          integral: res.data[0].userIntegral //用where查找的结果是一个集合，就算是1条数据，也必须用数组的表示方法（data[0]）
        })
      },
      fail(res) {
        console.log(res)
      }
    })
    getApp().aM_slideright(this, 'slideR_1', -100, 1) //左移100px，透明度变1,持续1秒
    this.setData({
      integralFlag: true
    })
  },

  /**
   * 获取用户登录信息(用户名)
   */
  getUserInfo: function(e) {
    // console.log(e)
    //app.globalData.userInfo = e.detail.userInfo
    wx.getUserInfo({
      success: res => {
        console.log(res.userInfo)
        this.setData({
          hasInfoFlag: true,
          userName: res.userInfo.nickName
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  /*前往设置界面*/
  goToSetting: function(event) {
    wx.navigateTo({
      url: '../../pages/setting/setting',
    })
  },

  /*前往我的书籍界面*/
  goToMybk: function(event) {
    wx.navigateTo({
      url: '../../pages/mybk/mybk',
    })
  },

  /*前往我的消息界面*/
  goToMyms: function(event) {
    wx.navigateTo({
      url: '../../pages/myms/myms?openid=' + getApp().globalData.openid,
    })
  }
})