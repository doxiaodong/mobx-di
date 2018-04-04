import { observable, action, runInAction, computed } from 'mobx'
import { Injectable, getInstance } from 'di'

import { getNews } from 'api'
import { Loadings } from 'stores/loadings'
import { ToasterStore } from 'stores/toaster'
import { UserStore } from 'stores/user'

const loadings = new Loadings()
const toaster = getInstance<ToasterStore>(ToasterStore)

@Injectable()
export class HomeStore {
  constructor(private _user: UserStore) {}
  @observable news = []

  @computed
  get loadings() {
    return loadings.state
  }

  @action.bound
  @loadings.handle('getNews')
  @toaster.handle()
  async getNews() {
    if (this._user.isLogin) {
      const news = await getNews(10)
      return runInAction(() => {
        this.news = news
      })
    }
    return Promise.reject({
      msg: 'need login'
    })
  }
}
