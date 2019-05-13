// pages/wish/wish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rewardFlag: false,
    loveNum: 0,
    trueLove: 0,
    falseLove: 5,
    bookName: "",
    authorName: "",
    wisher: ""
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
   * 悬赏开关事件：
   * 是否显示爱心值填写区域
   */
  changeRwFlag: function() {
    this.setData({
      rewardFlag: !this.data.rewardFlag
    })
    if (this.data.rewardFlag == false) {
      this.setData({
        trueLove: 0,
        falseLove: 5,
        loveNum: 0
      })
    }
    //console.log(this.data.rewardFlag)
  },

  /**
   * 爱心值改变
   */
  inLove: function(event) {
    let loveIn = event.currentTarget.dataset.in; //判断是增加爱心值 还是减少爱心值
    let loveNum_s;
    if (loveIn == 'add') {
      loveNum_s = Number(event.currentTarget.id) + this.data.trueLove
      // console.log(loveNum+" "+this.data.trueLove)
    } else {
      loveNum_s = Number(event.currentTarget.id)
      //  console.log(loveNum+" "+this.data.trueLove)
    }
    this.setData({
      trueLove: loveNum_s,
      falseLove: 5 - loveNum_s,
      loveNum: loveNum_s
    })
  },

  /**
   * 清除rewardFlag
   */
  clearRwFlag: function() {
    this.setData({
      rewardFlag: false
    })
  },

  /**
   * 清除爱心值
   */
  clearLove: function() {
    this.setData({
      trueLove: 0,
      falseLove: 5,
      loveNum: 0
    })
  },

  /**
   * 清除所有数据
   */
  clearAll: function() {
    this.clearRwFlag()
    this.clearLove()
  },

  /**
   * 提交表单
   */
  finishForm: function(event) {
    var _this = this
    _this.setData({
      bookName: event.detail.value.book,
      authorName: event.detail.value.author
    })
    //有悬赏先判断用户爱心值是否够抵消悬赏
    wx.getUserInfo({
      success: res => {
        _this.setData({
          wisher: res.userInfo.nickName //获取登录用户名
        })
      }
    })
    //console.log(this.data.wisher)
    const db = wx.cloud.database({
      env: 'sendbook-db-165e74'
    })
    db.collection('userMessages').where({
      userName: this.data.wisher
    }).get({
      success(res) {
        //console.log(res.data[0].userIntegral)
        //检测是否有详细的收/发件地址，没有则让用户填写
        if (getApp().globalData.address != "" && getApp().globalData.phoneNum != "") {
          if (res.data[0].userIntegral >= _this.data.loveNum) { //悬赏分够抵扣
            //上传数据并扣除相应的爱心值
            if (_this.data.bookName != "" && _this.data.authorName != "") {
              const db = wx.cloud.database({
                env: 'sendbook-db-165e74'
              })
              db.collection('wishBooks').add({
                data: {
                  bookName: _this.data.bookName,
                  bookAuthor: _this.data.authorName,
                  wisher: _this.data.wisher,
                  reward: _this.data.loveNum,
                  aimAddress: getApp().globalData.address,
                  geterPhone:getApp().globalData.phoneNum
                },
                success(res) {
                  //成功许愿，减去相应的爱心悬赏（若无开启悬赏，则-0）
                  wx.cloud.callFunction({
                      name: 'updateIntegral',
                      data: {
                        openid: getApp().globalData.openid,
                        number: -(_this.data.loveNum)
                      },
                    })
                    .then(res => {
                      console.log(res)
                    })
                    .catch(console.error)

                  //告知用户许愿成功
                  console.log("成功上传愿望！")
                  wx.showToast({
                    title: '许愿成功!',
                    icon: 'success',
                    duration: 1800
                  })
                },
                fail(res) {
                  console.log("上传愿望失败!", res)
                }
              })

            } else { //书名、作者有一个为空
              wx.showToast({
                title: '书籍信息不完整',
                icon: 'loading',
                duration: 2000
              })
            }
          } else { //爱心值不够
            wx.showToast({
              title: '您的爱心值不足',
              icon: 'loading',
              duration: 2000
            })
          }
        } else { //没有收件地址和联系方式
          wx.showModal({
            title: '没有填写取件地址及联系方式',
            content: '请先前往"个人中心-设置"填写再来许愿',
            showCancel: false
          })
        }
      },
      fail(res) {
        console.log("从数据库获取用户信息（爱心值）失败！", res)
      }
    })
  }
})