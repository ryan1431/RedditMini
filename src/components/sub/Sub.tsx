import './Sub.css';
import { CiTrash } from 'react-icons/ci';
import { BiAddToQueue } from 'react-icons/bi';
import type { size } from '../Subreddits';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks/hooks';
import { Subreddit } from '../../types';
import srdefault from '../../images/srdefault.jpeg';
export interface SubProps {
  sub: Subreddit;
  clicked: boolean;
  toggled?: Subreddit[];
}

export const Sub = ({sub, clicked, toggled}: SubProps) => {
  const { subs } = useAppSelector((state) => state.subreddits);

  const [size, setSize] = useState<size>('');
  const [add, setAdd] = useState<boolean>(false);

  useEffect(() => {
    setAdd(!(subs.some((sr) => sr.name === sub.name)));
    if (toggled) setAdd((p) => {
      if (toggled.some((sr) => sr.name === sub.name)) return !p
      else return p;
    })
  }, [subs, sub.name, toggled]);

  useEffect(() => {
    setSize(clicked ? '0' : '');
  }, [clicked]);

  return (
    <div id="sub-wrapper" style={{height: size, width: size}}>
      <div style={{display: 'flex'}}>
        <img className='sr-icon' src={sub.iconUrl || srdefault} alt="" />
        <p><span style={{color: 'grey', marginLeft: '7px'}}>r/</span>{sub.name}</p>
      </div>
      {/* <p>{sub.desc.slice(0, 20)}</p> */}
      <button className="remove-sub">
        { add 
          ? <BiAddToQueue className={'trash-icon'} />
          : <CiTrash className={'trash-icon'} />
        }
      </button>
    </div>
  );
}