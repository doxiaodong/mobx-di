import { observable, action, autorun } from 'mobx';

export class AutoRun {
  @observable a = true;
  @observable b = 'b';
  @observable c = 'c';

  constructor() {
    autorun(() => {
      console.log('relog', this.a ? this.c : this.b);
    });
  }

  @action.bound
  toggleA() {
    this.a = !this.a;
  }

  @action.bound
  changeB() {
    this.b += 'b';
  }

  @action.bound
  changeC() {
    this.c += 'c';
  }
}

export default new AutoRun();
