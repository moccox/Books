// pages/book/book.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageSrc: "",
    bookName: "",
    authorName: "",
    sender: "",
    collectionId: ""
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
    getApp().aM_slideup(this, 'slideU_1', 310, 1) //向上偏移310px并且渐现
    setTimeout(function() {
      getApp().aM_slideup(this, 'slideU_2', 310, 1) //延迟0.5s向上偏移310px并渐现
    }.bind(this), 500)
    setTimeout(function() {
      getApp().aM_slideup(this, 'slideU_3', 310, 1) //延迟1s向上偏移310px并渐现
    }.bind(this), 1000)
    setTimeout(function() {
      getApp().aM_slideup(this, 'slideU_4', 310, 1) //延迟1.5s向上偏移310px并渐现
    }.bind(this), 1500)
    setTimeout(function() {
      getApp().aM_slideup(this, 'slideU_5', 310, 1) //延迟2s向上偏移310px并渐现
    }.bind(this), 2000)
    setTimeout(function() {
      getApp().aM_slideup(this, 'slideU_6', 310, 1) //延迟3s向上偏移310px并渐现
    }.bind(this), 2500)
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
   * 删除选中的图片
   */
  clearImageSrc: function() {
    this.setData({
      imageSrc: ""
    })
  },

  /**
   * 添加封面照片(上限：1张)
   */
  addPicture: function(event) {
    var _this = this
    wx.chooseImage({
      count: 1, //上限1张
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        _this.setData({
          imageSrc: res.tempFilePaths[0]
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  /**
   * 书籍名称输入值改变，记录书籍名称
   * 作者输入改变，记录作者
   */
  /*
  changeBookName: function (event) {
    this.setData({
      bookName:event.detail.value
    })
   // console.log(this.data.bookName)
  },

  changeAuthor: function (event) {
    this.setData({
      author:event.detail.value
    })
   // console.log(this.data.author)
  },
  */
  /**
   * 取消Input当中每次内容改变就记录新值
   * 而是将input都放入表单中，输入完成点击提交按钮，再将最终值记录
   * 表单提交
   */
  finishForm: function(event) {
    var that = this
    this.setData({
      bookName: event.detail.value.book,
      authorName: event.detail.value.author
    })
    console.log("imageId:", this.data.imageId)
    //将图片src、书籍名称、作者 用户地址写入数据库
    //先判断信息是否全填写好（图片可选）
    if (this.data.bookName != "" && this.data.authorName != "") {
      wx.showLoading({
        title: '发布中'
      })
      //获取用户名
      wx.getUserInfo({
        success(res) {
          //console.log(res)
          that.setData({
            sender: res.userInfo.nickName
          })
          //将数据上传到数据库
          const db = wx.cloud.database({
            env: "sendbook-db-165e74"
          })
          db.collection('sendBooks').add({
            data: {
              bookName: that.data.bookName,
              bookAuthor: that.data.authorName,
              bookCover: "",
              sender: that.data.sender
            },
            success(res) {
              that.setData({
                id: res._id
              })
            },
            fail(res) {
              console.log("上传赠书数据失败！", res)
            }
          })
        },
        fail(res) {
          console.log("获取小程序端用户信息（用户名）失败！", res)
        }
      })
    } else {
      wx.showToast({
        title: '书籍信息不完整',
        icon: 'loading',
        duration: 2000
      })
    }
    //如果图片不为空，将图片上传至云端
    if (that.data.imageSrc != "") {
      setTimeout(function() {
        wx.cloud.uploadFile({
          cloudPath: new String("bookCover/" + that.data.id + ".jpg"),
          filePath: that.data.imageSrc,
          success(res) {
            console.log("上传图片到云端成功！")
            const db = wx.cloud.database({
          env: 'sendbook-db-165e74'
        })
        db.collection('sendBooks').doc(that.data.id).update({
          data: {
            bookCover: res.fileID
          },
          success(res){
            console.log("发布成功！")
            wx.hideLoading()
            wx.showToast({
              icon:'success',
              title: '发布成功！',
              duration:2000
            })
          },
          fail: console.error
        })
          },
          fail(res) {
            console.log("上传图片到云端失败！", res)
          }
        })
      }, 2000)
    }else{  //图片为空
      console.log("发布成功！")
      wx.hideLoading()
      wx.showToast({
        icon: 'success',
        title: '发布成功！',
        duration: 2000
      })
    }
  }
})