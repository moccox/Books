/**
 * 本函数用于修改用户地理位置
 * 参数：Object（包含省、市、县）
 * 功能：使用参数更新用户（根据openid识别）的地理信息*/
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env:'sendbook-db-165e74'
})
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    return await db.collection('userMessages').where({
      _openid: wxContext.OPENID
    })
      .update({
        data: {
          location: event.location.province + event.location.city + event.location.district
        },
      })
  } catch (e) {
    console.error(e)
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}