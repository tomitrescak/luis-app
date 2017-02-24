import * as React from 'react';
import { Header } from '../header';
import { mount } from 'enzyme';

// this is extended 'expectatio' library from 'https://github.com/mjackson/expect'
// we are not using 'jests' one as jest cannot run in browser

describe('Header', () => {

  story('Default View', 'Some **description**', () => {
    const component = <Header />;

    it('Renders correctly', function () {
      expect(mount(component)).toMatchSnapshot();
    });

    return component;
  })

  describe('With Decorator', () => {
    decorator((story) => (
      <div style={{ padding: '15px', background: 'red' }}>
        {story()}
      </div>
    ));

    story('Decorated View', 'Some **other description**', () => {
      const component = <Header />;

      it('Renders correctly', function () {
        expect(mount(component)).toMatchSnapshot();
      });

      return component;
    })

  });
});