// we need to register the proxy functions
import { observable } from 'mobx';
import { Router } from 'yester';
import { TestCatalogue } from './catalogue';
import { Story } from '../story';

console.log('Loading state ...');

export const globalCatalogue = new TestCatalogue();

// example mobx store 
export class RouteState {
  @observable path = [];
  @observable runningTests = false;
  viewedStory: Story = null;
  activeTab = 3;
  catalogue = globalCatalogue;
}
export const state = new RouteState();

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
