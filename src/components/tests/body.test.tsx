import * as React from 'react';

import { proxy } from 'proxyrequire';

const BodyProxy = proxy(() => require('../body').Body, {
  '../containers/container': { Container: () => <div>[Stubbed Container]</div> }
});

describe('Body', () => {
  story('Stubbed', () => {
    const proxiedBody = <BodyProxy />
    it ('is false', function() {
      expect(true).toBe(false);
    });

    return proxiedBody;
  })
});