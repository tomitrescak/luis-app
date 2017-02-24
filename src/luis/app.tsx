// we need to register the proxy functions
import { observable } from 'mobx';
import { Router } from 'yester';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { getRootNode } from './helpers';
import { StoriesView } from './components/story';
import DevTools from 'mobx-react-devtools';

// example mobx store 
class RouteState {
  @observable path = [];
  @observable runningTests = false;
}
const state = new RouteState();

// render app
const router = new Router([
  {
    $: '/:name/:path',
    enter: ({ params }) => {
      state.path = params['path'].split('-').map(p => parseInt(p, 10));
    }
  },
]);

router.init();

export function render(root = 'react-root') {
  ReactDOM.render(<div><StoriesView state={state} /><DevTools /></div>, getRootNode(root));
}

