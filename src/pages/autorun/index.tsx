import * as React from 'react';
import { observer } from 'mobx-react';

import Navbar from 'components/Navbar';
import store from './store';

@observer
export default class AutoRun extends React.Component {
  render() {
    console.log('rerender!!!');
    // const { a, b, c } = store
    return (
      <>
        <Navbar />
        <p>A: {store.a}</p>
        {store.a ? store.b : store.c}
        <button onClick={store.toggleA}>点击 A</button>
        <button onClick={store.changeB}>点击 B</button>
        <button onClick={store.changeC}>点击 C</button>
      </>
    );
  }
}
