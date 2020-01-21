/**
 * 判断是否是测试环境
 * @return Boolean
 */
function isTestEnv() {
  return (
    typeof process !== 'undefined' &&
    process.env &&
    process.env.NODE_ENV === 'test'
  );
}

/**
 * test only
 *
 * 用于标注 testOnly 的 api
 */
const testOnly = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  const replacer = (origin: any) =>
    function(...args: any[]) {
      if (!isTestEnv()) {
        console.error(
          `tusu: cannot use testOnly api (${propertyKey}) without Proxy and test env`,
        );
      }
      // @ts-ignore
      return origin.apply(this, args);
    };

  descriptor.value = replacer(descriptor.value);
  return descriptor;
};

type classType<T = any> = { new (...args: any[]): T };

class DI {
  constructor() {
    this.clear = this.clear.bind(this);
    this.register = this.register.bind(this);

    this.getInstance = this.getInstance.bind(this);
  }
  private _instancesMap = new Map();

  /**
   * test only
   *
   * 清空缓存的数据，用于单元测试间不相互干扰
   */
  @testOnly
  clear() {
    this._instancesMap.clear();
  }

  /**
   * test only
   *
   * 用于需要 mock 依赖的某个 store 的时候
   * 1. register(User, mockUser)
   * 2. TODO: 使用 Map ?
   * register([
   *  [User, MockUser],
   *  [Home, MockHome]
   * ])
   * @param target classType
   * @param newTarget classType
   */
  @testOnly
  register<S = any, T = any>(target: classType<S>, newTarget?: classType<T>) {
    if (typeof target === 'function' && typeof newTarget === 'function') {
      this._register(target, newTarget);
      return;
    }
  }

  /**
   * 类似于 new target()
   * @return target class instance
   */
  getInstance<T>(target: classType<T>): T {
    const self = this;
    // test only
    // 注意这里的 Proxy 只在测试环境中使用
    // 也就是说在生产环境中是没有 register(User, MockUser)，clear() 的操作的
    if (isTestEnv()) {
      // @ts-ignore
      return new Proxy(
        {},
        {
          get: function(obj, prop) {
            var ins = self._resolve(target);
            // @ts-ignore
            return ins[prop];
          },
          set: function(obj, prop, value) {
            var ins = self._resolve(target);
            // @ts-ignore
            ins[prop] = value;
            return true;
          },
        },
      );
    }
    return this._resolve(target);
  }

  private _register(target: classType, newTarget: classType) {
    const uid = this._getTargetUid(target);
    const hasInstance = this._instancesMap.has(uid);
    if (hasInstance) {
      this._instancesMap.delete(uid);
    }

    this._resolve(target, newTarget);
  }

  private _resolve<T>(target: classType<T>, newTarget?: classType): T {
    const uid = this._getTargetUid(target);
    // 缓存中获取实例
    if (this._instancesMap.has(uid)) {
      return this._instancesMap.get(uid);
    }

    // 实例化并缓存
    const instance = newTarget ? new newTarget() : new target();
    this._instancesMap.set(uid, instance);
    return instance;
  }

  private _getTargetUid<T>(target: classType<T>) {
    // 直接使用 target 本身作为 key
    return target;
  }
}

const { clear, register, getInstance } = new DI();

export { clear, register, getInstance };
