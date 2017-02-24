
import * as tests from './tests';
import { Story } from './story';

export class StoryGroup {
  name: string;
  storyGroups?: StoryGroup[];
  stories: Story[];
  parent: StoryGroup;

  private _decorator?: any;

  constructor(name: string, parent?: StoryGroup) {
    this.stories = [];
    this.storyGroups = [];
    this.name = name;
    this.parent = parent;
  }

  get root() {
    let parent: StoryGroup = this;
    while (parent.parent != null) { parent = parent.parent; }
    return parent;
  }

  get decorator() {
    if (this._decorator) {
      return this._decorator;
    }
    if (this.parent) {
      return this.parent.decorator;
    }
    return null;
  }

  set decorator(dec: any) {
    this._decorator = dec;
  }

  add(storyName: string, component: Function) {
    return this.addWithInfo(storyName, null, component);
  }

  addFolder(folderName: string) {
    if (!this.storyGroups) { this.storyGroups = []; }
    const folder = new StoryGroup(folderName, this);
    this.storyGroups.push(folder);
    return folder;
  }

  addWithInfo(storyName: string, info: string, component: Function) {
    const story = new Story(storyName, info, component, this.decorator);

    // add reference if we want to re-run tests
    story.tests = () => tests.runAsync(this, story);

    // run test now
    story.tests();

    this.stories.push(story);
    return this;
  }

  addDecorator(decorator: any) {
    this._decorator = decorator;
    return this;
  }
}

let parentGroup: StoryGroup = new StoryGroup('List of UIS');
let currentGroup: StoryGroup = parentGroup;
let currentStory: Story;

///////////////////////////////
// legacy functionality

function storiesOf(name: string) {
  let storyGroup = parentGroup.storyGroups.find(s => s.name === name);

  if (!storyGroup) {
    storyGroup = new StoryGroup(name, parentGroup);
    parentGroup.storyGroups.push(storyGroup);
    parentGroup.storyGroups.sort((a, b) => a.name < b.name ? -1 : 1);
  }

  return storyGroup;
}

///////////////////////////////
// new functionality

export function describe(storyName, func) {

  // add to stories
  let storyGroup = currentGroup.storyGroups.find(s => s.name === storyName);

  if (!storyGroup) {
    storyGroup = new StoryGroup(storyName, currentGroup);
    currentGroup.storyGroups.push(storyGroup);

    // sort by name
    currentGroup.storyGroups.sort((a, b) => a.name < b.name ? -1 : 1);
  }
  currentGroup = storyGroup;

  func.call(storyGroup);
  tests.callAfter();

  currentGroup = currentGroup.parent;
  currentGroup.storyGroups.sort((a, b) => a.name < b.name ? -1 : 1);
};

export function story(storyName: string, info: string | Function, component?: Function) {
  const story = new Story(
    storyName,
    component != null ? info as string : '',
    component != null ? component : info as Function,
    currentGroup.decorator);
  currentStory = story;
  currentGroup.stories.push(story);

  const runGroup = currentGroup;

  // add reference if we want to re-run tests
  story.tests = () => tests.runAsync(runGroup, story);
  story.tests();
}

export function decorator(decorator: any) {
  currentGroup.decorator = decorator;
}

let viewedStory: Story = null;

function action(actionName: string, impl?: Function) {
  return (...params: any[]) => {
    if (console.group) {
      console.group(`Action: ${actionName}`);
      // tslint:disable-next-line:no-console
      console.log(params);
      console.groupEnd();
    }
    if (impl) { impl(); }
    (viewedStory || currentStory).actions.push(`${actionName} (${params.map(p => p && p.target ? 'event' : JSON.stringify(p || 'null')).join(', ')})`);
  };
}

export function changeStory(story: Story) {
  viewedStory = story;
}

export function stories(state: { runningTests: boolean }) {
  if (!state.runningTests) {
    // setTimeout
  }
  return parentGroup;
}

export function registerTestGlobals() {
  global.tests = tests.tests;
  global.describe = describe;
  global.xdescribe = tests.xdescribe;
  global.it = tests.it;
  global.xit = tests.xit;
  global.before = tests.before;
  global.beforeAll = tests.before;
  global.afterAll = tests.after;
  global.after = tests.after;
  global.beforeEach = tests.beforeEach;
  global.afterEach = tests.afterEach;
}

export function registerStoryGlobals() {
  global.storiesOf = storiesOf;
  global.action = action;
  global.decorator = decorator;
  global.story = story;
}

export function registerGlobals() {
  registerStoryGlobals();
  registerTestGlobals();
}





