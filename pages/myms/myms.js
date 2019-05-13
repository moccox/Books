// pages/myms/myms.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mysent: new Array(),
    myget: new Array(),
    /*答应赠书弹窗相关数据*/
    showSFlag: false,
    sendBook: "",
    geter: "",
    geterAddress: "",
    geterPhone:"",
    /*确认收书弹窗相关数据*/
    showGFlag: false,
    getBook: "",
    sender: "",
    senderId:"",
    value:0,
    id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var openid = getApp().globalData.openid
    const db = wx.cloud.database({
      env: 'sendbook-db-165e74'
    })
    /*获取未发书消息*/
    db.collection('mails').where({
      senderId: openid
    }).get({
      success(res) {
        that.setData({
          mysent: res.data
        })
      },
      fail(res) {
        console.log(res)
      }
    })
    /*获取确认收书消息*/
    db.collection('mails').where({
      geterId: openid
    }).get({
      success(res) {
        that.setData({
          myget: res.data
        })
      },
      fail(res) {
        console.log(res)
      }
    })
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
   * 查看应赠书详情
   */
  showSent: function(event) {
    var index = event.currentTarget.dataset.index
    var that = this
    that.setData({
      sendBook: that.data.mysent[index].bookName,
      geter: that.data.mysent[index].geter,
      geterAddress: that.data.mysent[index].aimAddress,
      geterPhone:that.data.mysent[index].geterPhone,
      showSFlag: true
    })
  },
  /**
   * 关闭赠书详情弹窗
   */
  closeS: function() {
    this.setData({
      showSFlag: false
    })
  },

  /**
   * 查看确认收书详情
   */
  showGet: function(event) {
    var index = event.currentTarget.dataset.index
    var that = this
    that.setData({
      getBook: that.data.myget[index].bookName,
      sender: that.data.myget[index].sender,
      senderId: that.data.myget[index].senderId,
      value: that.data.myget[index].value,
      id: that.data.myget[index]._id,
      showGFlag: true
    })
  },

  /**
   * 关闭确认收书弹窗
   */
  closeG: function() {
    this.setData({
      showGFlag: false
    })
  },

  /**
   * 确认收书，删数据，加积分
   */
  got: function() {
    var that = this
    wx.cloud.callFunction({
      name: 'updateIntegral',
      data: {
        openid: that.data.senderId,
        number: that.data.value
      },
    })
      .then(res => {
        console.log(res)
      })
      .catch(console.error)

    wx.cloud.callFunction({
      name:'removeData',
      data:{
        collection: 'mails',
        id: that.data.id
      },
    })
    .then(res=>{
      console.log(res)
    })
    .catch(console.error)

    that.setData({
      showGFlag:false
    })

    that.onLoad()
  },

})