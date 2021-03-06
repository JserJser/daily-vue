/**
 * author: stephentian
 * email: stephentian@foxmail.com
 * day: 2019/1.19
 **/

const mongoose = require('mongoose')
const db = 'mongodb://localhost/regou-bd'

// glob 模块， 用来匹配文件路径
// 比如 lib/**/*.js 匹配 lib 目录下所有 js 文件
const glob = require('glob')

// resolve 可以将文件路径解析为绝对路径
const {
  resolve
} = require('path')

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}


exports.connect = () => {
  mongoose.connect(db)
  let connectTimes = 0
  return new Promise((resolve, reject) => {

    mongoose.connection.on('disconnected', () => {
      console.log('Connect to database fail!')
      if (connectTimes <= 3) {
        connectTimes++
        mongoose.connect(db)
      } else {
        reject()
        throw new Error('Datebase is Error!')
      }
    })

    mongoose.connection.on('error', err => {
      if (connectTimes <= 3) {
        connectTimes++
        mongoose.connect(db)
      } else {
        reject(err)
        throw new Error('Datebase is Error!')
      }
    })

    mongoose.connection.once('open', () => {
      console.log('Connect to database successfully!')
      resolve()
    })
  })
}