import axios from 'axios'

// 包装的axios ajax请求接口
function ajax1 (url, data={}, method='GET') {
  return new Promise(function (resolve, reject) {
    let promise

    if (method === 'GET') {
      // 准备url query参数数据
      let dataStr = ''
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }

      promise = axios.get(url)
    } else {
      promise = axios.post(url, data)
    }

    promise.then(function (response) {
      resolve(response)
    }).catch(function (error) {
      reject(error)
    })
  })
}
import ajax from "./ajax";
const BASE_URL = ''  // 移除重复的/api前缀，因为axios已经配置了baseURL

//登录
export const reqLogin = ({account, password}) => ajax1('/login', {account, password}, 'POST')  // 移除重复的/api

// 检测该邮箱账号是否已经被注册
export const reqAccountVerify = ({account})=>ajax(BASE_URL+'/user/accountVerify',{account})

// 注册账号
export const reqRegister = (account,password)=>ajax(BASE_URL+'/user/register',{account,password})

//getUserList得到用户列表
export const reqGetUserList = (page,pageSize)=>ajax(BASE_URL+'/getUserList',{page,pageSize})

//修改用户的的禁用状态
export const reqModifyUserStatus = (id,status)=>ajax(BASE_URL+'/modifyUserStatus',{id,status})

//得到用户的基本信息getUserInfo
export const reqGetUserInfo = (account)=>ajax(BASE_URL+'/getUserInfo',{account})

//修改密码
export const reqModUserPwd = (account,oldPassword,newPassword)=>ajax(BASE_URL+'/modifyUserPwd',{account,oldPassword,newPassword})

//更新用户信息
export const reqUpdateUserInfo = (userInfo, token) => ajax(BASE_URL+'/updateUserInfo', userInfo, 'POST', token)

//修改密码（新版本）
export const reqUpdatePassword = (passwordInfo, token) => ajax(BASE_URL+'/updatePassword', passwordInfo, 'POST', token)

