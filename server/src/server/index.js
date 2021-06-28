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
    const context = {}
    const html = render(store, routes, req, context)

    if (context.action === 'REPLACE') { // 要做重定向操作
      res.redirect(301, context.url)
    } else if (context.NOT_FOUND) {
      res.status(404)
      res.send(html)
    } else {
      res.send(html)
    }
    
  })
})

let server = app.listen(3000)