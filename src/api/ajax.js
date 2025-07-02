import axios from 'axios'

// 包装的axios ajax请求接口
export default function ajax (url, data={}, method='GET') {
  return new Promise(function (resolve, reject) {
    let promise

    if (method === 'GET') {
      // 准备url query参数数据，使用URLSearchParams进行正确的编码
      const params = new URLSearchParams()
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          params.append(key, data[key])
        }
      })

      if (params.toString()) {
        url = url + '?' + params.toString()
      }

      promise = axios.get(url)
    } else if (method === 'POST') {
      promise = axios.post(url, data)
    } else if (method === 'PUT') {
      promise = axios.put(url, data)
    } else if (method === 'DELETE') {
      promise = axios.delete(url, { data })
    } else {
      promise = axios.post(url, data)
    }

    promise.then(function (response) {
      resolve(response.data)
    }).catch(function (error) {
      reject(error)
    })
  })
}


