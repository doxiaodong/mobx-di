declare namespace Reflect {
  function getMetadata(string, target?: any, key?: string): any;
}

class DI {
  constructor() {
    this.Instance = this.Instance.bind(this);
    this.Injectable = this.Injectable.bind(this);
    this.replace = this.replace.bind(this);
  }
  private _depsMap = new Map();
  private _instancesMap = new Map();

  // @Instance() homeStore: HomeStore
  Instance() {
    return (target, key: string) => {
      const dep = Reflect.getMetadata('design:type', target, key);
      const self = this;
      Object.defineProperty(target, key, {
        get() {
          return self._resolve(dep);
        }
      });
    };
  }

  // @Injectable() class Store {}
  Injectable(forceInject = false) {
    return target => {
      this._inject(target, forceInject);
    };
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
      return this._replace(news, prevs);
    }
    news.forEach((n, i) => {
      this._replace(n, prevs[i]);
    });
  }

  private _replace(newTarget, prevTarget) {
    this._inject(newTarget, this._getTargetUid(prevTarget), true);
  }

  private _inject(target, fixedUid = null, forceInject = false) {
    const uid = fixedUid || this._getTargetUid(target);
    const deps = Reflect.getMetadata('design:paramtypes', target);
    const hasDep = this._depsMap.has(uid);
    const hasInstance = this._instancesMap.has(uid);
    if (!hasDep || forceInject) {
      this._depsMap.set(uid, deps);
    }
    if (forceInject && hasInstance) {
      this._instancesMap.delete(uid);
    }

    // 在 Inject 的时候就实例化 deps , 以达到可以替换实例的效果
    this._resolve(target, uid, forceInject);
    return target;
  }

  private _resolve(target, fixedUid = null, forceInject = false) {
    const uid = fixedUid || this._getTargetUid(target);
    // console.log('resolve deps: ', uid);
    if (this._instancesMap.has(uid) && !forceInject) {
      return this._instancesMap.get(uid);
    }
    const deps = this._fixDepsInstance(this._depsMap.get(uid));
    const instance = new target(...deps);
    this._instancesMap.set(uid, instance);
    return instance;
  }

  private _fixDepsInstance(deps) {
    const fixedDeps = deps || [];
    return fixedDeps.map(dep => {
      const uid = this._getTargetUid(dep);
      if (this._instancesMap.has(uid)) {
        return this._instancesMap.get(uid);
      }
      return new dep();
    });
  }

  private _getTargetUid(target) {
    // 直接使用 target 本身作为 key
    return target;
  }
}

const { Instance, Injectable, replace } = new DI();

export { DI, Instance, Injectable, replace };
