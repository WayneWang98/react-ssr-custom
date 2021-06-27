import express from 'express'
import proxy from 'express-http-proxy'
import { render } from './utils'
import { matchRoutes } from 'react-router-config'
import routes from '../Routes'
import { getStore } from '../store'

const app = express()
app.use(express.static('public')) // 服务器发现客户端在请求静态文件，会代理到根目录下的public文件夹

// server作为中间层进行代理
app.use('/api', proxy('http://47.95.113.63', {
  proxyReqPathResolver: function (req) {
    // var parts = req.url.split('?');
    // var queryString = parts[1];
    // var updatedPath = parts[0].replace(/test/, 'tent');
    // return updatedPath + (queryString ? '?' + queryString : '');
    return '/ssr/api' + req.url
  }
}))

app.get('*', function (req, res) {
  const store = getStore(req)
  // 根据路由的路径，在store里面加上数据
  // 让matchRoutes中所有组件的loadData都执行一次
  const matchedRoutes = matchRoutes(routes, req.path)
  const promises = []
  matchedRoutes.forEach(item => {
    if (item.route.loadData) {
      promises.push(item.route.loadData(store))
    }
  })

  Promise.all(promises).then(() => { // loadData是异步操作，需要等所有loadData执行完之后再去获取store
    res.send(render(store, routes, req))
  })
})

let server = app.listen(3000)