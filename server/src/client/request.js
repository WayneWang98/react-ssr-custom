import axios from 'axios'
import config from '../config'

const instance = axios.create({
  baseURL: '/',
  params: {
    secret: config.secret // 公用secret提取
  }
})

export default instance