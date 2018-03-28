import { observable, action, runInAction } from 'mobx'
import { Injectable } from '../../src'

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
