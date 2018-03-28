import * as React from 'react';
import { observer } from 'mobx-react';
import { Instance } from 'mobx-di';

import './beforeAll';
import Navbar from 'components/Navbar';
import { DIStore } from './store';

@observer
export default class DI extends React.Component {
  @Instance() diStore: DIStore;

  render() {
    return (
      <>
        <Navbar />
        <button onClick={this.diStore.toggle}>{this.diStore.btnDesc}</button>
        {JSON.stringify(this.diStore.userInfo)}
      </>
    );
  }
}
