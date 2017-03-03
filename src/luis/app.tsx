// we need to register the proxy functions
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { getRootNode } from './helpers';
import { StoriesView } from './components/story';
import DevTools from 'mobx-react-devtools';

import { state } from './state/state';

import 'rc-collapse/assets/index.css';

export function render(root = 'react-root') {
  ReactDOM.render(<div><StoriesView state={state} /><DevTools /></div>, getRootNode(root));
}

