import * as React from 'react';
import { Container } from '../containers/container';
import { TopHeader } from './header';

export const Body = () => (
  <div>
    <TopHeader />
    <span>This is my app</span>
    <Container />
    <span>This is footer</span>
  </div>
) 
