[![CircleCI](https://img.shields.io/circleci/project/github/doxiaodong/mobx-di.svg?style=flat-square)](https://circleci.com/gh/doxiaodong/mobx-di)
[![Coverage](https://img.shields.io/codecov/c/github/doxiaodong/mobx-di/master.svg?style=flat-square)](https://codecov.io/github/doxiaodong/mobx-di?branch=master)
[![Version](https://img.shields.io/npm/v/mobx-di.svg?style=flat-square)](https://www.npmjs.com/package/mobx-di)
[![License](https://img.shields.io/npm/l/mobx-di.svg?style=flat-square)]()

## Simple DI in mobx

## Usage

* `npm i mobx-di`

* Basic store User

```typescript
import { observable, action, runInAction } from 'mobx'
import { Injectable } from 'mobx-di'

@Injectable()
export class User {
  @observable
  userInfo = {
    isLogin: true,
    name: 'hmp',
    type: 0
  }

  @action.bound
  async logout() {
    await Promise.resolve(true) // 这一条模拟 API 请求
    return runInAction('logout', () => {
      this.userInfo.isLogin = false
    })
  }
}
```

* Another store which has the `User` dependence

```typescript
import { computed, action } from 'mobx'
import { Injectable } from 'mobx-di'

import { User } from '../stores/user'

@Injectable()
export class HomeStore {
  constructor(private _user: User) {
    console.log('user', _user)
  }
  @computed
  get userInfo() {
    return this._user.userInfo
  }

  @action.bound
  toggle() {
    return this._user.logout()
  }

  @computed
  get btnDesc() {
    return this.userInfo.isLogin ? '退出' : '登录'
  }
}
```

* Instance in component

```typescript
import * as React from 'react'
import { observer } from 'mobx-react'
import { Instance } from 'mobx-di'

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
```

## Advance

1.  You can replace any store in your code by `replace` mothod if you want,
    It's in `examples/pages/beforAll`

2.  If you want to use a store out of any class, you may need `getInstance(Class)`

3.  If you want multi instance of a store in multi modules, follow it

```typescript
import { DI } from 'mobx-di'
const di1 = new DI()
```

And then you can use the `di1.Injectable`, `di1.Instance`, `di1.replace`, `di1.getInstance`
