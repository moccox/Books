/**
 * 本函数用于修改用户爱心值
 * 参数：openid、爱心值b
 * 功能：将爱心值自增b
 * */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: 'sendbook-db-165e74'
})
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('userMessages').where({
        _openid: event.openid
      })
      .update({
        data: {
          userIntegral: _.inc(event.number) //自增number
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