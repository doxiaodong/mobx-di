declare namespace Reflect {
  function getMetadata(string, target?: any, key?: string): any;
}

class DI {
  constructor() {
    this.Instance = this.Instance.bind(this);
    this.Injectable = this.Injectable.bind(this);
    this.Inject = this.Inject.bind(this);
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

  // 用于强制替换 store , 方便测试
  Inject(...targets) {
    targets.forEach(target => {
      this._inject(target, true);
    });
  }

  private _inject(target, forceInject) {
    // target.name 在压缩后可能会重名
    // 重名默认是不会覆盖的
    // 所以建议给每个要 inject 的 class 加上唯一的 static injectName
    // 或者配合工具，在压缩代码前把 target.name 自动赋值给 injectName
    const name = target.injectName || target.name;
    const deps = Reflect.getMetadata('design:paramtypes', target);
    const hasDep = this._depsMap.has(name);
    const hasInstance = this._instancesMap.has(name);
    if (!hasDep || forceInject) {
      this._depsMap.set(name, deps);
    }
    if (forceInject && hasInstance) {
      this._instancesMap.delete(name);
    }

    // 在 Inject 的时候就实例化 deps , 以达到可以替换实例的效果
    this._resolve(target, forceInject);
    return target;
  }

  private _resolve(target, forceInject = false) {
    const name = target.injectName || target.name;
    console.log('resolve deps: ', name);
    if (this._instancesMap.has(name) && !forceInject) {
      return this._instancesMap.get(name);
    }
    const deps = this._fixDepsInstance(this._depsMap.get(name));
    const instance = new target(...deps);
    this._instancesMap.set(name, instance);
    return instance;
  }

  private _fixDepsInstance(deps) {
    const fixedDeps = deps || [];
    return fixedDeps.map(dep => {
      const name = dep.injectName || dep.name;
      if (this._instancesMap.has(name)) {
        return this._instancesMap.get(name);
      }
      return new dep();
    });
  }
}

const { Instance, Injectable, Inject } = new DI();

export { DI, Instance, Injectable, Inject };
