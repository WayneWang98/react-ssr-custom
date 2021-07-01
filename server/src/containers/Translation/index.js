import React, { Component } from 'react'
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
			<div className={styles.container}>
				{this.getList()}
			</div>
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
