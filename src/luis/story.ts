import { IObservableArray, observable, action } from 'mobx';
import { formatComponent } from './tests';

export class TestCatalogue {
  @observable catalogue = {};
  @observable passingTests = 0;
  @observable failingTests = 0;
  @observable hidePassing = false;

  count(current: any, failing = true) {
    let num = 0;
    Object.keys(current).map(k => {
      if (typeof current[k] === 'string') {
        num += failing && current[k] || !failing && !current[k] ? 1 : 0;
      } else {
        num += this.count(current[k], failing);
      }
    });
    return num;
  }

  @action updateHide(hide: boolean) {
    this.hidePassing = hide;
  }

  @action update(testName: string[], result?: string) {

    // create path
    let current = this.catalogue;
    for (let i = 0; i < testName.length - 1; i++) {
      const name = testName[i];
      if (!current[name]) {
        current[name] = {};
      }
      current = current[name];
    }
    current[testName[testName.length - 1]] = result || '';

    this.passingTests = this.count(this.catalogue, false);
    this.failingTests = this.count(this.catalogue, true); ;
  }
}

export const catalogue = new TestCatalogue();

export interface Snapshot {
  current: string;
  expected: string;
  name: string;
  matching: boolean;
}

export class Story {
  name: string;
  info: string;
  renderedComponent: Function;
  component: Function;

  actions: IObservableArray<string>;
  runTests = false;
  tests: () => void;

  @observable activeSnapshot: number;
  @observable snapshots: Snapshot[] = [];
  @observable testing: boolean = true;

  constructor(storyName: string, info: string, component: Function, decorator: Function) {
    this.name = storyName;
    this.info = '';
    this.component = component;
    this.renderedComponent = this.tryRender(component, decorator);
    this.actions = observable([]);

    if (info) {
      this.info = '### Description\n\n' + info + '\n\n';
    }

    this.info += '### Usage';
    let mount = component();

    if (mount) {
      this.info += `
\`\`\`javascript
${formatComponent(mount)}
\`\`\`
      `;
    }
  }

  tryRender(component: Function, decorator: Function) {
    return () => {
      try {
        return decorator ? decorator(() => component(false)) : component(false);
      } catch (ex) {
        console.error(ex);
        return 'Error: ' + ex.mesage;
      }
    };
  }
}
