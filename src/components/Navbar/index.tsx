import * as React from 'react'
import { observer } from 'mobx-react'
import { Menu } from 'antd'
import Link from 'umi/link'
import { Inject } from 'di'
import { NavbarStore } from './store'
import Toaster from '../Toaster'

@observer
export default class extends React.Component {
  @Inject() store: NavbarStore
  render() {
    return (
      <>
        <Toaster />
        <Menu
          mode="horizontal"
          selectedKeys={[this.store.activeKey]}
          onClick={this.store.handleClick}
        >
          <Menu.Item key="home">
            <Link to="/">Home</Link>
          </Menu.Item>
          {/* <Menu.Item key="user">
            <Link to="/user">User</Link>
          </Menu.Item> */}
        </Menu>
      </>
    )
  }
}
