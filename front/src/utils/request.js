import axios from 'axios'
import config from './config'   

// 全局操作
import router from '../router'
import store from '../store'

const request = axios.create({    //创建axios实例，在这里可以设置请求的默认配置
  timeout: 10000, // 设置超时时间10s
  baseURL:  config.requestConf.request
})



/** 添加请求拦截器 **/
request.interceptors.request.use(config => {
  return config
}, error=> {
  // 对请求错误做些什么
  return Promise.reject(error)
})

/** 添加响应拦截器  **/
request.interceptors.response.use(response => {
  return response.data
}, error => {
  
  return error
})

export default request