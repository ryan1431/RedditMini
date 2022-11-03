import './Sub.css';
import { CiTrash } from 'react-icons/ci';
import { BiAddToQueue } from 'react-icons/bi';
import type { size } from '../Subreddits';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks/hooks';

export interface SubProps {
  sub: string;
  clicked: boolean;
}

export const Sub = ({sub, clicked}: SubProps) => {
  const { subs } = useAppSelector((state) => state.subreddits);

  const [size, setSize] = useState<size>('');
  const [add, setAdd] = useState<boolean>(false);

  useEffect(() => {
    setAdd(!subs.includes(sub));
  }, [subs, sub])

  useEffect(() => {
    setSize(clicked ? '0' : '');
  }, [clicked]);

  const onMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = e.target;
    if (!(element instanceof HTMLDivElement)) return;

  }, []);

  return (
    <div id="sub-wrapper" onMouseUp={onMouseUp} style={{height: size, width: size}}>
      <div>
        <p>r/{sub}</p>
      </div>
      <button className="remove-sub">
        { add 
          ? <BiAddToQueue className={'trash-icon'} />
          : <CiTrash className={'trash-icon'} />
        }
      </button>
    </div>
  );
}