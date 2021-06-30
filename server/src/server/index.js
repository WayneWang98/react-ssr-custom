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
      const promise = new Promise((resolve, reject) => {
        item.route.loadData(store).then(resolve).catch(resolve)
      })
      promises.push(promise)
    }
  })

  // 一个页面要加载A\B\C\D 四个组件，都需要用loadData加载数据，假设A组件加载错误：
  // B、C、D不管成功还是失败，都会被执行


  // 一个页面要加载A\B\C\D 四个组件，都需要用loadData加载数据，假设A组件加载错误：
  // 1.B、C、D组件数据已经加载完成，此时能渲染出B、C、D组件
  // 2.B、C、D假设接口比较慢，A组件错误时，其他三个组件还没加载完成，会直接走catch，此时B、C、D组件无法渲染出来

  // promises = [a, b, c, d]
  // Promise.all(promises).then(() => { // loadData是异步操作，需要等所有loadData执行完之后再去获取store
  //   const context = {}
  //   const html = render(store, routes, req, context)

  //   if (context.action === 'REPLACE') { // 要做重定向操作
  //     res.redirect(301, context.url)
  //   } else if (context.NOT_FOUND) {
  //     res.status(404)
  //     res.send(html)
  //   } else {
  //     res.send(html)
  //   }
  // }).catch (() => {
  //   const context = {}
  //   const html = render(store, routes, req, context)

  //   if (context.action === 'REPLACE') {
  //     res.redirect(301, context.url)
  //   } else if (context.NOT_FOUND) {
  //     res.status(404)
  //     res.send(html)
  //   } else {
  //     res.send(html)
  //   }
  // })

  Promise.all(promises).then(() => { // loadData是异步操作，需要等所有loadData执行完之后再去获取store
    const context = {
      css: []
    }
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