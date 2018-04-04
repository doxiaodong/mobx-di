import * as React from 'react';
import { observer } from 'mobx-react';
import { getInstance, Inject } from 'di';

import './beforeAll';
import Navbar from 'components/Navbar';
import { DIStore } from './store';

const a = getInstance<DIStore>(DIStore);
console.log(a.userInfo.name);

@observer
export default class DI extends React.Component {
  @Inject() diStore: DIStore;

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
