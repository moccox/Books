// pages/index/index.js
const appData = getApp().globalData; //获取全局变量
var qqMapWx = require('../../utils/qqmap-wx-jssdk.js'); //获取QQ地图JS
var qqMapSDK;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchFlag: true,
    openid: "",
    top: 0,
    i: [1, 2, 3],
    locatedFlag: appData.locatedFlag,
    searchInputVal: '',
    navbarTitle: ["ta想赠书", "ta想收书", "同城用户"],
    aimClass: ["想送一本", "想收一本"],
    books: [
      new Array,
      new Array
    ],
    nearby: new Array,
    navbarActiveIndex: 0,
    location: {
      province: appData.location.province,
      city: appData.location.city,
      district: appData.location.district
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    qqMapSDK = new qqMapWx({ /*创建QQ地图应用实例*/
      key: '4ECBZ-V6DCQ-ABA5I-GKNYT-XZFK5-JGFNH' /*我的QQ地图秘钥*/
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    //从数据库获取详细收/发件地址
    wx.cloud.callFunction({
        name: 'getOpenid',
      })
      .then(res => {
        //console.log(res)
        that.setData({
          openid: res.result.openid
        })
        const db = wx.cloud.database({
          env: 'sendbook-db-165e74'
        })
        db.collection('userMessages').where({
          _openid: that.data.openid
        }).get({
          success(res) {
            if (res.data[0].address == "" || res.data[0].phoneNum == "") { //若详细地址或联系方式为空，则让用户先去填写地址
              wx.showModal({
                title: '未填写收、发件地址及联系方式',
                content: '会影响到相关功能的实现，请前往"个人中心-设置"填写',
                showCancel: false,
                success(res) { //用户点击确定，跳转到设置界面
                  wx.navigateTo({
                    url: '../../pages/setting/setting',
                  })
                }
              })
            } else {
              appData.address = res.data[0].address
              appData.phoneNum = res.data[0].phoneNum
            }
          },
          fail(res) {
            console.log("获取详细地址失败！", res)
          }
        })
      })
      .catch(console.error);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    //在数据库创建关于本用户的信息集合（由于openid的唯一性，同一个帐户只会创建一次）
    setTimeout(function() {
      const db = wx.cloud.database({
        env: 'sendbook-db-165e74'
      })
      db.collection('userMessages').add({
        data: {
          userName: new String(appData.userName),
          userIntegral: 10,
          location: new String(''),
          address: new String(''),
          phoneNum: new String('')
        },
        success(res) {
          //console.log("成功创建用户信息", res)
        },
        fail(res) {
          //console.log("创建用户信息失败", res)
        }
      });
    }, 5000)

    const db = wx.cloud.database({
      env: 'sendbook-db-165e74'
    })
    //获取赠书列表
    db.collection('sendBooks').where({
      _openid: db.command.neq(appData.openid) //把用户赠书除外，避免刷分
    }).get({
      success(res) {
        var books_0 = "books[" + 0 + "]" //
        that.setData({
          //写 books[0]:res.data 会报语法错误，所以得先用books_0把字符拼接起来
          [books_0]: res.data
        })
      },
      fail(res) {
        console.log("获取赠书数据失败！", res)
      }
    });

    //获取心愿列表(按悬赏降序排序)
    db.collection('wishBooks').where({
      _openid: db.command.neq(appData.openid)
    }).orderBy('reward', 'desc').get({
      success(res) {
        var books_1 = "books[" + 1 + "]"
        that.setData({
          [books_1]: res.data
        })
      },
      fail(res) {
        console.log("获取心愿数据失败！", res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

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
   * 改变搜索栏样式：
   * 1.flag==true----搜索按钮显示，搜索栏隐藏
   * 2.flag==false----搜索按钮隐藏，搜索栏显示
   */
  changeSearchFlag: function() {
    this.setData({
      searchFlag: !this.data.searchFlag
    })
    //console.log(this.data.searchFlag)
  },

  /**
   * 搜索输入框内容变化事件：
   * 修改searchInputVal的值
   */
  changeInputVal: function(event) {
    this.setData({
      searchInputVal: event.detail.value
    });
    //console.log(this.data.searchInputVal)
  },

  /**
   * 搜索按钮单击事件：
   * 开始搜索搜索栏中的内容
   */
  startSearching: function() {
    //-----未完善--------//
    //计划：将searchInputVal作为搜索判断条件，往数据库中搜索数据
    if (this.data.searchInputVal == '') {
      wx.showModal({
        title: '无内容',
        content: '请输入内容再进行搜索',
        showCancel: false
      })
    } else {
      console.log(this.data.searchInputVal)
      wx.navigateTo({
        url: '../../pages/search/search?content=' + this.data.searchInputVal,
      })
    }
  },
  /**
   * 地址图标单击事件：获取定位
   * a.在设置中允许启用定位
   * b.先获取经纬度定位，再获取地图定位
   */
  getLocation: function() {
    let _this = this
    wx.getSetting({ //请求用户授权更改设置
      success: (res) => {
        console.log(JSON.stringify(res))
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //设置中尚未授权定位，请求授权更改设置
          wx.showModal({ //弹窗
            title: '请求授权当前位置',
            content: '请您授权您当前的地理位置',
            success: function(res) {
              if (res.cancel) { //拒绝授权更改设置
                wx.showToast({
                  title: '您已拒绝授权！',
                  icon: 'none',
                  duration: 1000 //持续1秒
                })
              } else if (res.confirm) { //同意授权更改设置
                wx.openSetting({ //打开设置
                  success: function(datatAu) { //打开设置成功
                    if (dataAu.authSetting["scope.userLocation"] == true) { //已经授权定位
                      wx.showToast({
                        title: '授权成功！',
                        icon: 'success',
                        duration: 1000
                      })
                      getApp().getLatitudeLongitude(); //获取经纬度
                      //console.log(appData.latitude+","+appData.longitude)
                      _this.getLocal(appData.latitude, appData.longitude) //通过经纬度获取地图定位
                    } else { //打开设置失败
                      wx.showToast({
                        title: '授权失败！',
                        icon: "none",
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else { //设置中已经授权定位
          getApp().getLatitudeLongitude()
          //console.log(appData.latitude+","+appData.longitude)
          _this.getLocal(appData.latitude, appData.longitude) //通过经纬度获取地图定位
        }
      }
    })
  },
  /**
   * 获取地图定位
   * （@纬度，@经度）
   */
  getLocal(lat, long) {
    let ts = this
    //console.log(lat + "~~~~" + long)
    qqMapSDK.reverseGeocoder({ //使用QQ地图获取地理位置
      location: {
        latitude: lat,
        longitude: long
      },
      success: function(res) { //成功获取
        //console.log(JSON.stringify(res))
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        let district = res.result.ad_info.district
        ts.setData({
          location: {
            province: province,
            city: city,
            district: district
          }
        })
        appData.location = ts.data.location //同步定位到全局变量
        //console.log(ts.data.location.province+ts.data.location.city)
        ts.setData({
          locatedFlag: true //定位标志改为true
        })
        console.log("globalData-loaction", appData.location)
        //更新数据库中位置信息
        wx.cloud.callFunction({
            name: 'updateLocation',
            data: {
              location: ts.data.location
            },
          })
          .then(res => {
            console.log(res.result)
          })
          .catch(console.error)

      },
      fail: function(res) { //获取失败
        console.log(res)
      }
    });

    //获取附近的人列表
    if (ts.data.location.city != "") { //因为是利用模糊查找同城人，所以必须保证查找条件不能为空，否则查找结果是全部数据
      const db = wx.cloud.database({
        env: 'sendbook-db-165e74'
      })
      db.collection('userMessages').where({
        location: new db.RegExp({ //模糊查找，location中城市的值相同即可
          regexp: ts.data.location.city
        }),
        _openid: db.command.neq(appData.openid) //用户自己排除
      }).get({
        success(res) {
          console.log("获取附近的人成功！", res)
          ts.setData({
            nearby: res.data
          })
        },
        fail(res) {
          console.log("获取附近的人失败！", res)
        }
      })
    }
  },
  /**
   * 导航栏项目单击
   */
  navbarTapClick: function(e) {
    //将当前活跃的id改为点击的navbar项目的id
    this.setData({
      navbarActiveIndex: e.currentTarget.id
    })

  },
  /**
   * swiper组件滑动事件：滑动项目页修改导航栏项目
   */
  onBindAnimationFinish: function({
    detail
  }) {
    this.setData({
      navbarActiveIndex: detail.current
    })
  },
  /**
   * 整个页面滑动事件
   */
  scroll: function(event) {
    this.setData({
      top: event.detail.scrollTop
    })
    //console.log(this.data.top)
  },

  /**
   * 返回页面顶部
   */
  goToTop: function(event) {
    this.setData({
      top: 0
    })
  },

  /**
   *跳转到detail页面（模式：收书） 
   */
  getBook: function(event) {
    let id = event.currentTarget.dataset.id
    let flag = 0 //flag为0表示以收书模式加载detail页面
    wx.navigateTo({
      url: '../../pages/detail/detail?id=' + id + '&flag=' + flag,
    })
  },

  /**
   * 跳转到detail页面（模式：送书）
   */
  achieveWish: function(event) {
    let id = event.currentTarget.dataset.id
    let flag = 1 //flag为1表示以送书模式加载detail页面
    wx.navigateTo({
      url: '../../pages/detail/detail?id=' + id + '&flag=' + flag,
    })
  }
})