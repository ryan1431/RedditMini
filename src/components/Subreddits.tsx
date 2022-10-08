import React from 'react';
import './Subreddits.css';

import type { CSS } from './Home';

interface SubredditsProps extends CSS {}

export const Subreddits = (props: SubredditsProps) => {

  const { basis, border } = props;

  return (
    <div id="subreddits" style={{flexBasis: basis, maxWidth: basis, border: border}}>
      <p>here's an element</p>
    </div>
  )
}