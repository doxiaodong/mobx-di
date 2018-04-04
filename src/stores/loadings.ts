import { observable, extendObservable, action } from 'mobx'

export class Loadings {
  @observable names = []
  @observable state: { [key: string]: boolean } = {}

  constructor(...names) {
    names.forEach(name => this.add(name))
  }

  @action
  add(name) {
    this.names.push(name)
    extendObservable(this.state, {
      [name]: false
    })
  }

  tryAdd(name) {
    if (!this.state.hasOwnProperty(name)) {
      this.add(name)
    }
  }

  @action
  start(name) {
    this.tryAdd(name)
    this.state[name] = true
  }

  @action
  stop(name) {
    this.tryAdd(name)
    this.state[name] = false
  }

  finished(name) {
    return !this.state[name]
  }

  allFinished() {
    return this.names.reduce(
      (finished, name) => finished && this.finished(name),
      true
    )
  }

  promise(name, promise) {
    this.start(name)
    const stopLoading = () => this.stop(name)
    promise.then(stopLoading, stopLoading)
    return promise
  }

  handle(name) {
    this.tryAdd(name)
    const loadings = this
    return (target, key, descriptor) => {
      const origin = descriptor.value
      descriptor.value = function(...args) {
        const promise = origin.apply(this, args)
        return loadings.promise(name, promise)
      }
      return descriptor
    }
  }
}
