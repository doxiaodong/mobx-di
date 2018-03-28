import { computed, action } from 'mobx';
import { Injectable } from 'mobx-di';

import { User } from 'stores/user';

@Injectable()
export class DIStore {
  constructor(private _user: User) {
    console.log('user', _user);
  }
  @computed
  get userInfo() {
    return this._user.userInfo;
  }

  @action.bound
  toggle() {
    return this._user.logout();
  }

  @computed
  get btnDesc() {
    return this.userInfo.isLogin ? '退出' : '登录';
  }
}
