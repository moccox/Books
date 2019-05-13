// pages/setting/setting.js
const appData = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    settingFlag: false,
    address:appData.address,
    phoneNum:appData.phoneNum
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(appData.phoneNum)
    this.setData({
      address:appData.address,
      phoneNum:appData.phoneNum
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /*更改是否设置地址Flag*/
  changeSFlag: function(event){
    this.setData({
      settingFlag:!this.data.settingFlag
    })
  },


  /*提交表单*/
  submit: function(event){
    var that = this
    //保存内容
    this.setData({
      address: event.detail.value.address,
      phoneNum:event.detail.value.phoneNum
    })
    //console.log("address:",this.data.address)
    getApp().globalData.address = that.data.address //同步地址给全局变量
    getApp().globalData.phoneNum = that.data.phoneNum
   // console.log("global-address:",getApp().globalData.address)

   //数据库更新详细地址
   wx.cloud.callFunction({
     name:'updateAddress',
     data:{
       address: that.data.address,
       phoneNum:that.data.phoneNum,
       openid: getApp().globalData.openid
     }
   })
   .then(res=>{
     console.log(res)
   })
   .catch(console.error)

    //更改Flag
    this.changeSFlag()
  }
})