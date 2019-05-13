/**
 * 本函数用于获取用户的openid
 * 参数：无
 * 功能：返回用户openid
*/
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    openid: wxContext.OPENID
  }
}