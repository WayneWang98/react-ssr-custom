import React, { Component } from 'react'

// 这个函数返回一个高阶组件
export default (DecoratedComponent, styles) => {
  return class NewComponent extends Component { // 高阶组件
    componentWillMount () {
      if (this.props.staticContext) { // 客户端渲染不会走这个逻辑
        this.props.staticContext.css.push(styles._getCss())
      }
    }

    render () {
      return <DecoratedComponent {...this.props} />
    }
  }
}