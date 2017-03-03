import * as React from 'react';
import * as Collapse from 'rc-collapse';
import { style } from 'typestyle';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import 'rc-collapse/assets/index.css';
import { stories, changeStory } from '../louis';
import { StoryGroupView, menu } from './story_group';
import * as SplitPane from 'react-split-pane';
import * as Tabs from 'react-simpletabs';
import * as marked from 'marked';
import { Story } from '../story';
import { RouteState } from '../state/state';

import { MonacoEditor } from './editor';

require('./highlighter');

const requireConfig = {
  url: 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
  paths: {
    'vs': '/libs/monaco/0.8.0/vs'
  }
};

// Synchronous highlighting with highlight.js
marked.setOptions({
  highlight: function (code) {
    return Prism.highlight(code, Prism.languages['jsx']);
  }
});

const resizeEvent = new Event('resize');
const Panel = Collapse.Panel;
const container = style({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  background: 'white',
  $nest: {
    '.rc-collapse': {
      border: '0px!important'
    },
  },
  borderRight: 'solid 1px #dedede'
});

const content = style({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  background: 'white',
  padding: '12px'
});

const tabs = style({
  background: 'white',
  width: '100%',
  height: '100%',
  $nest: {
    '& .tabs-menu': {
      display: 'table',
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    '& .tabs-navigation': {
      borderTop: 'solid 1px #ddd',
      borderBottom: 'solid 1px #ddd',
    },
    '& .tabs-menu-item': {
      float: 'left',
      marginRight: '20px',
      marginLeft: '12px',
      padding: '6px 0px'
    },
    '& .tabs-menu-item a': {
      cursor: 'pointer',
      display: 'block',
      color: '#A9A9A9'
    },
    '& .tabs-menu-item:not(.is-active) a:hover': {
      color: '#3498DB'
    },
    '& .tabs-menu-item.is-active a': {
      color: '#3498DB'
    },
    '& .tab-panel': {
      padding: '10px'
    },
    '& .fail': {
      color: 'red'
    },
    '& .pass': {
      color: 'green'
    }

  }

});

const split = style({
  background: 'white',
  $nest: {
    '& .Resizer': {
      background: '#000',
      opacity: .2,
      zIndex: 1,
      boxSizing: 'border-box',
      backgroundClip: 'padding-box'
    },
    '& .Resizer:hover': {
      transition: 'all 2s ease'
    },
    '& .Resizer.horizontal': {
      height: '11px',
      margin: '-5px 0',
      borderTop: '5px solid rgba(255, 255, 255, 0)',
      borderBottom: '5px solid rgba(255, 255, 255, 0)',
      cursor: 'row-resize',
      width: '100%'
    },
    '& .Resizer.horizontal:hover': {
      borderTop: '5px solid rgba(0, 0, 0, 0.5)',
      borderBottom: '5px solid rgba(0, 0, 0, 0.5)'
    },
    '& .Resizer.vertical': {
      width: '11px',
      margin: '0 -5px',
      borderLeft: '5px solid rgba(255, 255, 255, 0)',
      borderRight: '5px solid rgba(255, 255, 255, 0)',
      cursor: 'col-resize'
    },
    '& .Resizer.vertical:hover': {
      borderLeft: '5px solid rgba(0, 0, 0, 0.5)',
      borderRight: '5px solid rgba(0, 0, 0, 0.5)'
    },
    '& .SplitPane.horizontal': {
      position: 'inherit!important' as any
    }
  }
});

const bottomTabPane = style({
  position: 'absolute',
  top: '36px',
  bottom: '0px',
  overflow: 'auto',
  left: '6px',
  right: '6px'
});

const defaultStory = () => <div>'No story'</div>;
const header = style({
  marginLeft: `20px`
});

const snapshotSelect = style({
  marginLeft: '10px'
});

const hidePassing = style({
  float: 'right'
});

const toolBelt = style({
  width: '100%',
  padding: '6px'
});

function renderFields(state: RouteState, current: Object) {
  if (!current) {
    return <div>No tests ...</div>;
  }
  return Object.keys(current).map((k, i) => {
    if (typeof current[k] === 'string') {
      return current[k] ?
        <div key={i}><span className="fail">[FAIL] {`${k}: ${current[k]}`}</span></div> :
        state.catalogue.hidePassing || <div key={i}><span className="pass">[PASS] {`${k}`}</span></div>;
    } else {
      return (
        <div key={i}>
          <span>{k}</span>
          <div className={header}>
            {renderFields(state, current[k])}
          </div>
        </div>
      );
    }
  });
}

// Story tests

export interface StoriesTitleParams {
  testsRoot: Object;
  state: RouteState;
}

export const StoryTestsTitle = observer(({ testsRoot, state }: StoriesTitleParams) => (
  <span>Story Tests [<span className="pass">{state.catalogue.count(testsRoot, false)}</span> / <span className="fail">{state.catalogue.count(testsRoot, true)}</span>]</span>
));

export interface StoriesParams {
  story: Story;
  testsRoot: Object;
  title: any;
  state: RouteState;
}

export const StoryTests = observer(({ testsRoot, story, state }: StoriesParams) => (
  <div className={bottomTabPane}>
    <div className={hidePassing}>
      <input type="checkbox" defaultChecked={state.catalogue.hidePassing} onChange={(e) => { state.catalogue.hidePassing = e.currentTarget.checked; }} /> Hide Passing
    </div>
    {story && story.testing && <span>Running tests ...</span>}
    {renderFields(state, testsRoot)}
  </div>
));

// All tests

export interface AllTestsProps {
  title?: any;
  state: RouteState;
}

export const AllTestsTitle = observer(({ state }: AllTestsProps) => (
  <span>All Tests [
    <span className="pass">{state.catalogue.passingTests}</span> /
    <span className="fail">{state.catalogue.failingTests}</span>]
  </span>
));

export const AllTests = observer(({ state }: AllTestsProps) => (
  <div className={bottomTabPane}>
    <div className={hidePassing}>
      <input type="checkbox" defaultChecked={state.catalogue.hidePassing} onChange={(e) => { state.catalogue.hidePassing = e.currentTarget.checked; }} /> Hide Passing
    </div>
    {renderFields(state, state.catalogue.catalogue)}
  </div>
));

export interface ActionProps {
  title: any;
  story: Story;
}
export const Actions = observer(({ story }: ActionProps) => {
  return (
    <div className={bottomTabPane}>
      {story && story.actions.map(a => (
        <div>{a}</div>
      ))}
    </div>
  );
});


export interface SnapshotsProps {
  title?: any;
  story: Story;
}
export const SnapshotsTitle = observer(({ story }: SnapshotsProps) => (
  <span>Snapshots [
    <span className="pass">{story.snapshots.filter(s => s.matching).length}</span> /
    <span className="fail">{story.snapshots.filter(s => !s.matching).length}</span>]
  </span>
));

function updateSnapshot(button: HTMLButtonElement, story: Story, snapshotName) {
  button.textContent = 'Updating ...';
  fetch(`/snapshot?snapshot=${snapshotName}&update=true`)
    .then(function (response) {
      return response.text();
    })
    .then(function () {
      button.textContent = 'Update Snapshot';
      // rerun tests
      story.snapshots = [];
      story.tests();
    });
}

@observer
export class Snapshots extends React.PureComponent<SnapshotsProps, {}> {

  editor: monaco.editor.IStandaloneDiffEditor;

  initEditor = (mountEditor: any) => {
    this.editor = mountEditor as any;
    this.setModel();
  }

  setModel = () => {
    let original = monaco.editor.createModel(this.props.story.snapshots[this.props.story.activeSnapshot].current, 'text/plain');
    let modified = monaco.editor.createModel(this.props.story.snapshots[this.props.story.activeSnapshot].expected, 'text/plain');
    monaco.editor.setModelLanguage(original, 'json');
    monaco.editor.setModelLanguage(modified, 'json');

    this.editor.setModel({ original, modified });
  }

  render() {
    const story = this.props.story;
    return (
      <div className={bottomTabPane} style={{ overflow: 'hidden' }}>
        <div className={toolBelt}>
          <select onChange={e => { story.activeSnapshot = parseInt(e.currentTarget.value, 10); }}>
            {story.snapshots.map((s, i) => (
              <option value={i} key={i}>{s.name}</option>
            ))}
          </select>
          <button className={snapshotSelect} onClick={(e) => updateSnapshot(e.currentTarget, story, story.snapshots[story.activeSnapshot].name)}>Update Snapshot</button>
        </div>

        <MonacoEditor key="HistoryView"
          editorDidMount={this.initEditor}
          theme="vs-light"
          width="100%"
          height="100%"
          clientValue={this.props.story.snapshots[this.props.story.activeSnapshot].current}
          serverValue={this.props.story.snapshots[this.props.story.activeSnapshot].expected}
          requireConfig={requireConfig}
        />
      </div>
    );
  }
};

interface Props {
  state: RouteState;
}

export const StoriesView = observer(({ state }: Props) => {
  let RenderStory: any = null;
  const rootGroup = stories(state);
  let storyPath = state.path;
  let activeKey = undefined;

  let story: Story;
  let groupPath = [];

  if (storyPath && storyPath.length) {
    // select by path
    activeKey = storyPath[0].toString();
    let group = rootGroup.storyGroups[storyPath[0]];
    groupPath.push(group.name);

    for (let i = 1; i < storyPath.length - 1; i++) {
      group = group.storyGroups[storyPath[i]];

      if (!group) {
        location.href = '/';
        return <div>Invalid path. Please <a href="/">Go Back</a></div>;
      }

      groupPath.push(group.name);
    }

    // now find the story
    story = group.stories[storyPath[storyPath.length - 1]];
    if (!story) {
      location.href = '/';
      return <div>Invalid path. Please <a href="/">Go Back</a></div>;
    }
    groupPath.push(story.name);
    const cmp = story.renderedComponent;

    // RenderStory = group.stories[storyPath[storyPath.length - 1]].component;
    RenderStory = cmp;
  } else {
    RenderStory = defaultStory;
  }

  // find the root in catalogue
  let testsRoot = state.catalogue.catalogue[groupPath[0]];
  for (let i = 1; i < groupPath.length; i++) {
    if (testsRoot) {
      testsRoot = testsRoot[groupPath[i]];
    }
  }

  // change to current story
  changeStory(story);

  // sort by name
  // rootGroup.storyGroups.sort((a, b) => a.name < b.name ? -1 : 1);

  return (
    <div>
      <SplitPane className={split} split="vertical"
        minSize={100}
        defaultSize={parseInt(localStorage.getItem('luis-v-splitPos'), 10)}
        onChange={size => localStorage.setItem('luis-v-splitPos', size)}>
        <div className={container}>
          <Collapse accordion={true} defaultActiveKey={activeKey}>
            {
              rootGroup.storyGroups.map((g, i) => (
                <Panel key={i.toString()} header={g.name} className={menu}>
                  <StoryGroupView storyGroup={g} path={storyPath && storyPath.length && i === storyPath[0] ? toJS(storyPath) : undefined} />
                </Panel>)
              )
            }
          </Collapse>
        </div>
        <SplitPane split="horizontal"
          defaultSize={parseInt(localStorage.getItem('luis-h-splitPos'), 10)}
          onChange={size => {
            localStorage.setItem('luis-h-splitPos', size);
            window.dispatchEvent(resizeEvent);
          }} minSize={100}>
          <div className={content}>
            <RenderStory />
          </div>
          <div className={tabs}>
            <Tabs tabActive={state.activeTab} onAfterChange={(index) => state.activeTab = index}>
              <div title="Info" className={bottomTabPane}>
                {story && <div dangerouslySetInnerHTML={{ __html: marked(story.info || 'No Info') }}></div>}
              </div>
              <Actions title="Actions" story={story} />
              <StoryTests state={state} title={testsRoot ? <StoryTestsTitle state={state} testsRoot={testsRoot} /> : 'Story Tests'} story={story} testsRoot={testsRoot} />
              <AllTests state={state} title={<AllTestsTitle state={state} />} />
              {story && story.snapshots.length &&
                <Snapshots title={<SnapshotsTitle story={story} />} story={story} />}
            </Tabs>
          </div>
        </SplitPane>
      </SplitPane>
    </div>
  );
});


