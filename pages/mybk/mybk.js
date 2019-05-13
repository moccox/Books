// pages/mybk/mybk.js
const appData = getApp().globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mysend: new Array(),
    mywish: new Array(),
    tapIndex_1: 99999999, //表示被点击的项目id，用于动画找对象
    tapIndex_2: 9999999
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log("onLoad")
    const db = wx.cloud.database({
      env: 'sendbook-db-165e74'
    })
    db.collection('sendBooks').where({
      _openid: appData.openid
    }).get({
      success(res) {
        that.setData({
          mysend: res.data
        })
      },
      fail(res) {
        console.log(res)
      }
    })

    db.collection('wishBooks').where({
      _openid: appData.openid
    }).get({
      success(res) {
        that.setData({
          mywish: res.data
        })
      },
      fail(res) {
        console.log(res)
      }
    })

    console.log(that.data.mysend, that.data.mywish)
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
   * 删除赠书
   */
  checkDeleteSend: function(event) {
    var that = this
    var id = event.currentTarget.dataset.id
    var index = event.currentTarget.dataset.index
    wx.showModal({
      title: '确定要删除该赠书吗？',
      content: '删除后将不可恢复，是否继续？',
      success(res) {
        if (res.confirm) { //点击确定，删除赠书
          console.log(index)
          that.setData({
            tapIndex_1: index
          })
          getApp().aM_scale(that, 'showAnimation_1', 2000, 0.3, 0.5, 0) //动画
          const db = wx.cloud.database({
            env: 'sendbook-db-165e74'
          })
          db.collection('sendBooks').doc(id).remove({
            success: that.refresh(), //语法限制只能写一句代码，于是将代码块写入函数中再调用函数
            fail: console.error
          })
        }
        if (res.cancel);
      }
    })
  },

  /**
   * 删除心愿
   */
  checkDeleteWish: function(event) {
    var that = this
    var id = event.currentTarget.dataset.id
    var index = event.currentTarget.dataset.index
    console.log(event.currentTarget)
    wx.showModal({
      title: '确定要删除该心愿吗？',
      content: '删除后将不可恢复，悬赏爱心亦不返还，是否继续？',
      success(res) {
        if (res.confirm) {
          that.setData({
            tapIndex_2: index
          })
          getApp().aM_scale(that, 'showAnimation_2', 2000, 0.3, 0.5, 0)
          const db = wx.cloud.database({
            env: 'sendbook-db-165e74'
          })
          db.collection('wishBooks').doc(id).remove({
            success: that.refresh(),
            fail: console.error
          })
        }
        if (res.cancel);
      }
    })
  },

  /*刷新页面*/
  refresh: function() {
    var that = this
    that.data.mysend.splice(0, that.data.mysend.length) //清空数据
    that.data.mywish.splice(0, that.data.mywish.length)
    setTimeout(function() {
      getApp().aM_scale(that,'showAnimation_1',0,1,1,1) //动画缩小+透明后效果还在，下面替换上来的数据会隐形（大小也缩放了sx，sy倍），所以需要再施加一次动画将样式缩放1*1
      getApp().aM_scale(that,'showAnimation_2',0,1,1,1)
      that.setData({
        tapIndex_1:9999999999,
        tapIndex_2:9999999999
      })
      that.onLoad()
    }, 2000)

    console.log(that.data.tapIndex_1, that.data.tapIndex_2)
  }
})