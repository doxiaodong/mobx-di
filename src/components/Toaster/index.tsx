import * as React from 'react'
import { observer } from 'mobx-react'
import { Alert } from 'antd'
import { Inject } from 'di'
import { ToasterStore } from 'stores/toaster'

@observer
export default class extends React.Component {
  @Inject() toasterStore: ToasterStore
  render() {
    if (!this.toasterStore.current) {
      return null
    }
    const { title, msg, type } = this.toasterStore.current
    return <Alert banner closable message={title || msg} type={type} />
  }
}
