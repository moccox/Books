// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchCnotent:"",
    sendByBook:new Array(),
    wishByBook:new Array(),
    sendByAuthor:new Array(),
    wishByAuthor:new Array()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //获取从index页面带来的数据
    let content = options.content
    that.setData({
      searchCnotent:options.content
    })
    console.log("searchContent:",that.data.searchCnotent)
    //从数据库搜索相关信息
    const db = wx.cloud.database({
      env:'sendbook-db-165e74'
    })
    /*根据书名模糊查找-赠书、收书*/
    db.collection('sendBooks').where({
      bookName:new db.RegExp({
        regexp:content,
        options:'i' //大小写不敏感
      })
    }).get({
      success(res) {
        that.setData({
          sendByBook: res.data
        })
        console.log(that.data.sendByBook)
      },
      fail(res) {
        console.log("sendbook1", res)
      }
    })

    db.collection('wishBooks').where({
      bookName:new db.RegExp({
        regexp:content,
        options:'i'
      })
    }).get({
      success(res) {
        that.setData({
          wishByBook: res.data
        })
        console.log(that.data.wishByBook)
      },
      fail(res) {
        console.log("wishbook1", res)
      }
    })

    /*根据作者模糊查找-赠书、收书*/
    db.collection('sendBooks').where({
      bookAuthor:new db.RegExp({
        regexp:content,
        options:'i'
      })
    }).get({
      success(res){
        that.setData({
          sendByAuthor:res.data
        })
      },
      fail(res){
        console.log("sendbook2",res)
      }
    })

    db.collection('wishBooks').where({
      bookAuthor:new db.RegExp({
        regexp:content,
        options:'i'
      })
    }).get({
      success(res){
        that.setData({
          wishByAuthor:res.data
        })
      },
      fail(res){
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
   * 点击送书项 前往收书
  */
  getBook: function(event){
    let id = event.currentTarget.dataset.id
    let flag = 0 //flag为0表示以收书模式加载detail页面
    wx.navigateTo({
      url: '../../pages/detail/detail?id=' + id + '&flag=' + flag,
    })
  },

  /**
   * 点击心愿项 前往送书
  */
  sendBook: function(event){
    let id = event.currentTarget.dataset.id
    let flag = 1 //flag为1表示以送书模式加载detail页面
    wx.navigateTo({
      url: '../../pages/detail/detail?id=' + id + '&flag=' + flag,
    })
  }
})