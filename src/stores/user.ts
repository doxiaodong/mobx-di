import { observable, action, runInAction, computed } from 'mobx'
import { Injectable } from 'di'

import { overview, login, logout } from 'api'
import { Loadings } from 'stores/loadings'

const loadings = new Loadings()

@Injectable()
export class UserStore {
  @observable userInfo = null

  @computed
  get loadings() {
    return loadings.state
  }

  @computed
  get isLogin() {
    return this.userInfo !== null
  }

  @action.bound
  @loadings.handle('overview')
  async overview() {
    const userInfo = await overview()
    return runInAction('overview', () => {
      this.userInfo = userInfo
    })
  }

  @action.bound
  @loadings.handle('logout')
  async logout() {
    await logout()
    return runInAction('logout', () => {
      this.userInfo = null
    })
  }
}
