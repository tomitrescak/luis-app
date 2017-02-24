import * as React from 'react';
import { Container } from '../containers/container';
import { Header } from './header';

export const Body = () => (
  <div>
    <Header />
    <span>This is my app</span>
    <Container />
    <span>This is footer</span>
  </div>
) 
