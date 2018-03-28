import * as React from 'react'
import { observer } from 'mobx-react'

import './beforeAll'
import { Instance } from '../../src'
import { HomeStore } from './store'

@observer
export default class Home extends React.Component {
  @Instance() home: HomeStore

  render() {
    return (
      <>
        <button onClick={this.home.toggle}>{this.home.btnDesc}</button>
        {JSON.stringify(this.home.userInfo)}
      </>
    )
  }
}
