import ShallowWrapper from 'enzyme/build/ShallowWrapper';
import ReactWrapper from 'enzyme/build/ReactWrapper';
import { Dropdown } from 'semantic-ui-react';

ShallowWrapper.prototype.change = function (this: ShallowWrapper, value: string) {
  change(this, value);
};
ReactWrapper.prototype.change = function (this: ShallowWrapper, value: string) {
  change(this, value);
};
function change(wrapper: any, value: string) {
  wrapper.node.value = value;
}
ShallowWrapper.prototype.select = function (this: ShallowWrapper, number: string) {
  select(this, number);
};
ReactWrapper.prototype.select = function (this: ShallowWrapper, number: string) {
  select(this, number);
};
function select(wrapper: any, value: string) {
  wrapper.simulate('click').find(Dropdown.Item).at(value).simulate('click');
}

export function getRootNode(rootId: string) {
  const rootNode = document.getElementById(rootId);

  if (rootNode) {
    return rootNode;
  }

  const rootNodeHtml = '<div id="' + rootId + '"></div>';
  const body = document.getElementsByTagName('body')[0];
  body.insertAdjacentHTML('beforeend', rootNodeHtml);

  return document.getElementById(rootId);
}