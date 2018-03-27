import * as React from 'react';
import { observer } from 'mobx-react';

import Navbar from 'components/Navbar';
import userStore from 'stores/user';

@observer
export default class Home extends React.Component {
  render() {
    return (
      <>
        <Navbar />
        <button onClick={userStore.logout}>退出</button>
        {JSON.stringify(userStore.userInfo)}
      </>
    );
  }
}
