import React, { Component, Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { getTranslationList } from './store/actions'
import { Redirect } from 'react-router-dom' // 只会在客户端做redirect操作
import styles from './style.css'
import withStyle from '../../withStyle'

class Translation extends Component {

	getList() {
		const { list } = this.props
		return list.map(item => <div key={item.id} className={styles.item}>{item.title}</div>)
	}

	render() {
		return this.props.login ? (
			<Fragment>
				<Helmet>
					<title>这是wayne wang 的ssr翻译页--有很多的翻译信息哦</title>
					<meta name="description" content="丰富多彩的翻译内容"></meta>
				</Helmet>
				<div className={styles.container}>
					{this.getList()}
				</div>
			</Fragment>
		) : <Redirect to='/' /> 
	}

	componentDidMount() {
		if (!this.props.list.length) { // 折中方案，不能屏蔽这几行代码，如果屏蔽了无法获取store中的数据
			this.props.getTranslationList()
		}
	}
}

const mapStateToProps = state => ({
	list: state.translation.translationList,
	login: state.header.login
})

const mapDispatchToProps = dispatch => ({
	getTranslationList() {
		dispatch(getTranslationList())
	}
})

const ExportTranslation = connect(mapStateToProps, mapDispatchToProps)(withStyle(Translation, styles))
ExportTranslation.loadData = (store) => {
	// 这个函数，负责在服务器端渲染之前，把这个路由需要的数据提前加载好
	return store.dispatch(getTranslationList())
}

export default ExportTranslation
