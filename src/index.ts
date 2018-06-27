import 'core-js/es7/reflect'

declare namespace Reflect {
  function getMetadata(string, target?: any, key?: string): any
}

class DI {
  constructor() {
    this.Inject = this.Inject.bind(this)
    this.Injectable = this.Injectable.bind(this)
    this.replace = this.replace.bind(this)
    this.getInstance = this.getInstance.bind(this)
  }
  private _depsMap = new Map()
  private _instancesMap = new Map()

  // ts: @Inject() homeStore: HomeStore
  // js/ts: @Inject(HomeStore): homeStore
  Inject<T>(jsdep?: { new (...args): T }) {
    return (target, key: string) => {
      const dep = jsdep || Reflect.getMetadata('design:type', target, key)
      const self = this
      Object.defineProperty(target, key, {
        get() {
          return self.getInstance(dep)
        }
      })
    }
  }

  // ts: @Injectable() class Store {}
  // js/ts: @Injectable(A, B, C) class Store {}
  Injectable(...args: { new (...args): any }[]) {
    return target => {
      if (args.length === 0) {
        this._inject(target)
      } else {
        this._inject(target, args)
      }
    }
  }

  /**
   * 1. replace(newTarget, oldTarget)
   * 2. replace([newTarget1, newTarget2, ...], [oldTarget1, oldTarget2, ...])
   * @param news target | target[]
   * @param prevs target | target []
   */
  replace(news, prevs) {
    // TODO: 检查非法输入
    if (!Array.isArray(news)) {
      return this._replace(news, prevs)
    }
    news.forEach((n, i) => {
      this._replace(n, prevs[i])
    })
  }

  getInstance<T>(dep: { new (...args): T }): T {
    return this._resolve(dep)
  }

  private _replace(newTarget, prevTarget) {
    this._inject(newTarget, null, this._getTargetUid(prevTarget))
  }

  private _inject(
    target,
    // js 用法需要传入的 jsDeps
    jsDeps: any[] = null,
    // replace 需要的修正的 target
    fixedUid = null
  ) {
    // 如果有 fixedUid ，则强制替换掉依赖
    const forceInject = !!fixedUid
    const uid = fixedUid || this._getTargetUid(target)
    const hasDep = this._depsMap.has(uid)
    const hasInstance = this._instancesMap.has(uid)
    if (!hasDep || forceInject) {
      const deps = jsDeps || Reflect.getMetadata('design:paramtypes', target)
      deps && this._depsMap.set(uid, deps)
    }
    if (forceInject && hasInstance) {
      this._instancesMap.delete(uid)
    }

    // 在 Inject 的时候就实例化 deps , 以达到可以替换实例的效果
    this._resolve(target, uid, forceInject)
    return target
  }

  private _resolve(target, fixedUid = null, forceInject = false) {
    const uid = fixedUid || this._getTargetUid(target)
    // console.log('resolve deps: ', uid);
    if (this._instancesMap.has(uid) && !forceInject) {
      return this._instancesMap.get(uid)
    }
    const deps = this._fixDepsInstance(this._depsMap.get(uid))
    const instance = new target(...deps)
    this._instancesMap.set(uid, instance)
    return instance
  }

  private _fixDepsInstance(deps) {
    const fixedDeps = deps || []
    return fixedDeps.map(dep => {
      const uid = this._getTargetUid(dep)
      if (this._instancesMap.has(uid)) {
        return this._instancesMap.get(uid)
      }
      return new dep()
    })
  }

  private _getTargetUid(target) {
    // 直接使用 target 本身作为 key
    return target
  }
}

const { Inject, Injectable, replace, getInstance } = new DI()

export { DI, Inject, Injectable, replace, getInstance }
