import * as React from 'react'
import { observer } from 'mobx-react'
import { List, Spin } from 'antd'
import { Inject } from 'di'
import { HomeStore } from './store'
import Navbar from 'components/Navbar'

@observer
export default class Home extends React.Component {
  @Inject() store: HomeStore

  componentWillMount() {
    this.store.getNews()
  }

  render() {
    const loading = this.store.loadings.getNews
    return (
      <>
        <Navbar />
        <Spin spinning={loading} size="large">
          <List
            bordered
            dataSource={this.store.news}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
              </List.Item>
            )}
          />
        </Spin>
      </>
    )
  }
}
