import { Story, catalogue } from './story';
import { StoryGroup } from './louis';
import toJson from 'enzyme-to-json';

declare var fetch: any;

let beforeEachFunc = null;
let afterEachFunc = null;
let afterFunc = null;
let testMode = false;
let testName = [];
let testQueue: QueuedItem[] = [];
let currentItem: QueuedItem;

let running = false;
let t;

interface QueuedItem { story: Story; group: StoryGroup; }

export function runAsync(group: StoryGroup, story: Story, priority = false) { /** */
  if (priority) {
    testQueue.unshift({ story, group });
  } else {
    testQueue.push({ story, group });
  }
  // run queue asynchronously
  if (running) {
    return;
  }
  running = true;

  if (t) {
    clearTimeout(t);
  }
  t = setTimeout(runQueue, 100);
}

function runQueue() {
  const queuedStory = testQueue.shift();
  run(queuedStory);

  if (testQueue.length) {
    runQueue();
  } else {
    running = false;
  }
}

function run(item: QueuedItem) {
  currentItem = item;
  item.story.testing = true;
  testMode = true;

  // create test name
  testName = [item.story.name];

  let group = item.group;
  while (group.parent != null) {
    testName.unshift(group.name);
    group = group.parent;
  }

  beforeEachFunc = null;
  afterFunc = null;
  afterEachFunc = null;

  try {
    // run story, and if contains tests it will 
    item.story.component();
  } catch (e) {
    console.error(e);
    catalogue.update(testName, e);
  };
  testMode = false;

  item.story.testing = false;
}


export function tests(specs) {
  if (testMode) {
    specs();
  }
}

export const it = function (desc, func) {
  if (!testMode) {
    return;
  }
  testName.push(desc);

  if (beforeEachFunc) { beforeEachFunc(); }
  try {
    func();
    catalogue.update(testName);
  } catch (e) {
    if (console.group) {
      console.group('Failed: ' + testName.join(' > '));
    }
    console.error(e);
    if (console.group) {
      console.groupEnd();
    }
    catalogue.update(testName, e.message);
  }

  if (afterEachFunc) { afterEachFunc(); }
  testName.pop();
};

// snapshot testing

// const ReactElementPlugin = require('./pretty-print/react_element');
import * as ReactElementPlugin from 'pretty-format/build/plugins/ReactElement';
import * as ReactTestComponentPlugin from 'pretty-format/build/plugins/ReactTestComponent';
// const ReactTestComponentPlugin = require('./pretty-print/react_test_component');
import * as prettyFormat from 'pretty-format';

let PLUGINS = [ReactElementPlugin, ReactTestComponentPlugin];

export function formatComponent (component: any) {
  return prettyFormat(component, {
    escapeRegex: true,
    plugins: PLUGINS,
    printFunctionName: true,
  });
}

function trim(str: string) {
  str = str.trim();
  if (str[0] === '"') {
    str = str.substring(1, str.length - 2).trim().replace(/\\"/g, '"');
  }
  return str;
}

export function createClientSnapshotMatcher(expect: any) {
  expect.extend({
    toMatchSnapshot(this: { actual: any}) {
      let story = currentItem.story;
      let currentTestName = [...testName];

      // expect.assert(
      //   this.actual.match(/^#[a-fA-F0-9]{3,6}$/),
      //   'expected %s to be an HTML color',
      //   this.actual
      // )
      let snap = toJson(this.actual);
      let ser = prettyFormat(snap, {
        escapeRegex: true,
        plugins: PLUGINS,
        printFunctionName: false,
      });

      // get snapshot from server
      const name = testName.join(' ');
      fetch(`/snapshot?snapshot=${name}`)
        .then(function (response) {
          return response.text();
        })
        .then(function (json) {
          const current = trim(ser);
          const expected = trim(json);

          let matching = false;
          if (current === expected) {
            // console.log('SAME');
            matching = true;
          } else {
            // console.log('DIFFER');

            // update all tests and update current tests
            catalogue.update(currentTestName, 'Snaphots do not match!');
          }

          const snapshot = {
            current,
            expected,
            name,
            matching
          };
          story.snapshots.push(snapshot);
          if (story.snapshots.length === 1) {
            story.activeSnapshot = 0;
          }
        });
      return this;
    }
  });
}

export const beforeEach = function (func) {
  beforeEachFunc = func;
};

export const afterEach = function (func) {
  afterEachFunc = func;
};

export const before = function (func) {
  func();
};

export const after = function (func) {
  afterFunc = func;
};

export const callAfter = () => afterFunc && afterFunc();

export const xit = function () {
  /** */
};

export const xdescribe = function (storyName) {
  return storyName;
};
