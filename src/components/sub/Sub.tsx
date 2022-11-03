import './Sub.css';
import { CiTrash } from 'react-icons/ci';
import type { size } from '../Subreddits';
import { useEffect, useState } from 'react';

export interface SubProps {
  sub: string,
  clicked: boolean,
}

export const Sub = ({sub, clicked}: SubProps) => {

  const [size, setSize] = useState<size>('');

  useEffect(() => {
    setSize(clicked ? '0' : '');
  }, [clicked]) 

  return (
    <div id="sub-wrapper" style={{height: size, width: size}}>
      <div>
        <p>r/{sub}</p>
      </div>
      <button className="remove-sub">
        <CiTrash className={'trash-icon'} />
      </button>
    </div>
  );
}