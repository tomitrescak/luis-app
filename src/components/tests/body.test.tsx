import * as React from 'react';

export const Comp = <div>Component</div>;

describe('Body', () => {
  story('Default', () => {

    it ('is true', function() {
      expect(true).toBe(true);
    });

    return Comp;
  });

  story('Extended', () => {
    it ('is false', function() {
      expect(true).toBe(false);
    });

    return Comp;
  })
});