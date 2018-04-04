import { observable, action, runInAction, computed } from 'mobx'
import { Injectable } from 'di'

@Injectable()
export class NavbarStore {
  // TODO: 根据路由决定初始 key
  @observable activeKey = 'home'

  @action.bound
  handleClick(e) {
    this.activeKey = e.key
  }
}

export default new NavbarStore()
