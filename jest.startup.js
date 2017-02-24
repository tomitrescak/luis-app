global.shouldMock = true;

// legacy functionality

function add(name, story) {
  story();

  return {
    add,
    addWithInfo,
    addFolder
  }
}

function addWithInfo(name, info, story) {
  story();

  return {
    add,
    addWithInfo,
    addFolder
  }
}

function addFolder(name) {
  return {
    add,
    addWithInfo,
    addFolder
  }
}

function addDecorator() {
  return {
    add,
    addWithInfo,
    addFolder
  }
}

function storiesOf() {
  return {
    addDecorator,
    add
  }
}

function specs(func) {
  func();
}

function tests(func) {
  func();
}

// new functionality

function story(name, desc, func) {
  if (func) {
    func();
  } else {
    desc();
  }
}

function decorator() {
}

global.action = function() { return () => true };
global.storiesOf = storiesOf;
global.specs = specs;
global.tests = tests;
global.story = (name, info, impl) => describe(name, impl || info);
global.decorator = decorator;
global.i18n = (key) => key;

console.log(global.story);