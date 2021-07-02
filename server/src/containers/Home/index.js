import React, { Component, Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { getHomeList } from './store/actions'
import withStyle from '../../withStyle'
import styles from './style.css'

class Home extends Component {

	componentWillMount () {
		if (this.props.staticContext) { // 客户端渲染不会走这个逻辑
			this.props.staticContext.css.push(styles._getCss())
		}
	}

	getList() {
		const { list } = this.props
		return list.map(item => <div key={item.id} className={styles.item}>{item.title}</div>)
	}

	render() {
		return (
			<Fragment>
				<Helmet>
					<title>这是wayne wang 的ssr新闻首页--丰富多彩的咨询</title>
					<meta name="description" content="这是wayne wang 的ssr新闻首页"></meta>
				</Helmet>
				<div className={styles.container}>
					{this.getList()}
				</div>
			</Fragment>
		)
	}

	componentDidMount() {
		if (!this.props.list.length) { // 折中方案，不能屏蔽这几行代码，如果屏蔽了无法获取store中的数据
			this.props.getHomeList()
		}
	}
}

const mapStateToProps = state => ({
	list: state.home.newsList
});

const mapDispatchToProps = dispatch => ({
	getHomeList() {
		dispatch(getHomeList())
	}
})

const ExportHome = connect(mapStateToProps, mapDispatchToProps)(withStyle(Home, styles))
ExportHome.loadData = (store) => {
	// 这个函数，负责在服务器端渲染之前，把这个路由需要的数据提前加载好
	return store.dispatch(getHomeList())
}

export default ExportHome
