// configure stubbing (see: https://github.com/tomitrescak/proxyrequire)
global.$_stubs_$ = {};
function proxyRequire (require, path) {
   return global.$_stubs_$[path] || require(path);
};
global.proxyRequire = proxyRequire;

import "rc-collapse/assets/index.css";
import "diff-view/diffview.css";
import "./luis/reset.css";

import { registerGlobals as stubGlobals } from 'proxyrequire';
stubGlobals()

// register global variables
import { registerGlobals } from './luis/louis';
registerGlobals();

// configure expectations
import { createClientSnapshotMatcher } from './luis/tests';

import * as expect from 'jest-matchers';
global.expect = expect;
createClientSnapshotMatcher(expect);

// configure hmr
import { setStatefulModules } from './hmr';
setStatefulModules(name => {
  // Add the things you think are stateful:
  return /state/.test(name);
});

// import all stories
import './components/tests';

// render luis
import { render } from './luis/app';
render();