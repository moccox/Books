/**
 * 本函数用于删除数据库中的一组数据
 * 参数：数据所在集合名，数据id
 * 功能：删除id对应数据
*/
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env:'sendbook-db-165e74'
})
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection(event.collection).where({
      _id: event.id
    }).remove()
  } catch (e) {
    console.error(e)
  }
}