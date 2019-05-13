/**
 * 本函数用于更新用户的详细地址
 * 参数：详细地址,联系方式,openid
 * 功能：更新用户（根据openid识别）的详细地址和联系方式
*/
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
      _openid: event.openid
    })
      .update({
        data: {
          address: event.address,
          phoneNum:event.phoneNum
        },
      })
  } catch (e) {
    console.error(e)
  }
  return {
    event,
    openid: wxContext.OPENID
  }
}