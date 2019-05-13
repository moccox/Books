// pages/detail/detail.js
const appData = getApp().globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    flag: "",
    message: new Array(),
    a: "",
    b: "", //a 送书给 b
    c:"", //collection
    a_id:"",
    b_id:"",
    bookName:"",  //书
    address: "", //收书地址
    phoneNum:"",  //联系方式
    bookValue:1  //书本总价值（基础价值1，有悬赏则加悬赏）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取从其他页面带来的数据
    var that = this
    that.setData({
      id: options.id,
      flag: options.flag
    });
    const db = wx.cloud.database({
      env: 'sendbook-db-165e74'
    })
    //根据id获取书籍信息
    if (that.data.flag == 0) { //flag为0，从赠书集合获取书籍信息
      db.collection('sendBooks').doc(that.data.id).get({
        success(res) {
          //console.log(res.data)
          that.setData({
            message: res.data
          })
        },
        fail(res) {
          console.log(res)
        }
      })
    } else { //flag为1，从心愿集合获取书籍信息
      db.collection('wishBooks').doc(that.data.id).get({
        success(res) {
          //console.log(res.data)
          that.setData({
            message: res.data,
            bookValue:(res.data.reward+1)//此模式下，书本价值=基础价值+悬赏值
          })
        },
        fail(res) {
          console.log("???",res)
        }
      })
    };
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
   * 赠书被收/心愿被实现
   * 生成一条信息，表明赠收双方关系及书本名、地址
   * 此mail表明：a应该送书给b，并记录书名
   */
  addMail: function() {
    var that = this
    const db = wx.cloud.database({
      env: 'sendbook-db-165e74'
    })
    if (that.data.flag == 0) { //收书模式，a是对方，b是用户
      that.setData({
        a: that.data.message.sender,
        a_id:that.data.message._openid,
        b:appData.userName,
        b_id: getApp().globalData.openid,
        c: 'sendBooks', //collection是sendBooks
        address: getApp().globalData.address, //地址是己方详细地址
        phoneNum:getApp().globalData.phoneNum  //联系方式是自己的联系方式
      })
    } else { //送书模式，a是用户，b是对方
      that.setData({
        a:getApp().globalData.userName,
        a_id: appData.openid,      
        b: that.data.message.wisher,
        b_id:that.data.message._openid,
        c: 'wishBooks', //collection是wishBooks
        address: that.data.message.aimAddress, //地址是对方的详细地址
        phoneNum:that.data.message.geterPhone //联系方式是对方的联系方式
      })
    }
    //将信息写入数据库
    if(that.data.a!=that.data.b){ //防止自己送自己造成刷分
      if(appData.address=="" || appData.phoneNum==""){
        wx.showModal({
          title: '未填写收件地址及联系方式',
          content: '您未填写收件地址及联系方式，对方无法寄书给您',
          showCancel:false,
          success(res) { //用户点击确定，跳转到设置界面
            wx.navigateTo({
              url: '../../pages/setting/setting',
            })
          }
        })
      }else{
        db.collection('mails').add({
          data: {
            _id: that.data.id, //为避免重复添加，将书本信息中的id作为mail的key
            sender: that.data.a,
            geter: that.data.b,
            senderId: that.data.a_id,//避免双方改名丢失数据目标，用openid识别
            geterId: that.data.b_id,
            bookName: that.data.message.bookName,
            aimAddress: that.data.address, //地址是用户详细地址
            geterPhone: that.data.phoneNum, //联系方式
            value: that.data.bookValue  //书本价值
          },
          success(res) {
            console.log("成功添加 mail", res)
            wx.showToast({
              title: '操作成功！',
              icon: 'success',
              duration: 2000
            })
            /**删除赠书、收书意愿**/
            wx.cloud.callFunction({
              name: 'removeData',
              data: {
                collection: that.data.c,
                id: that.data.id
              },
            })
              .then(res => {
                console.log(res)
                wx.navigateBack()
              })
              .catch(console.error)
          },
          fail(res) {
            console.log(res)
          }
        })
      }
      
    }else{
      wx.showModal({
        title: '不能收送自己的书喔~',
        content: '请不要做这种吃力不讨好的工作吖',
        showCancel:false
      })
    }
  },

  /**
   * 送书前先弹窗问一下意愿
   * */
   checkSend: function(){
     var that = this
     wx.showModal({
       title: '是否送出书籍？',
       content: '送出本书，您将获得'+that.data.bookValue+'点爱心值',
       success(res){
         if(res.confirm){ //用户点击确定
          that.addMail()
         }else if(res.cancel){  //用户点击取消
         }
       }
     })
   }
})