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
import { ExtendedImport } from 'luis';
import { createClientSnapshotMatcher } from './luis/tests';
import * as expectImp from 'expect';
createClientSnapshotMatcher(expectImp);
global.expect = expectImp;

// configure hmr
import {setStatefulModules} from './hmr';
setStatefulModules('hmr');

declare global {
  const expect: <T>(obj: T) => ExtendedImport<T>;
}

// import all stories
import './components/tests';

// render luis
import { render } from './luis/app';
render();