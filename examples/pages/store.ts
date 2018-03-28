import { computed, action } from 'mobx'

import { User } from '../stores/user'
import { Injectable } from '../../src'

@Injectable()
export class HomeStore {
  static injectName = 'DIStore'
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
