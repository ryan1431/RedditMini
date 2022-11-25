import './Sub.css';
import { CiTrash } from 'react-icons/ci';
import { BiAddToQueue } from 'react-icons/bi';
import { useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';
import { Subreddit } from '../../types';
import srdefault from '../../media/srdefault.jpeg';
import { toggleResult, toggleSubreddit } from '../../app/reducers/subredditsSlice';
import clsx from 'clsx';
export interface SubProps {
  sub: Subreddit;
  result?: boolean;
}

export type size = '' | '0';

export const Sub = ({sub, result}: SubProps) => {
  const dispatch = useAppDispatch();
  
  const subs = useAppSelector(s => s.subreddits.in_storage.subs);

  const [size, setSize] = useState<size>('');
  const toggleQueue = useAppSelector((s) => s.subreddits.toggleQueue)

  const add = useMemo(() => {
    let willAdd = !subs.some((s) => s.name === sub.name);
    return result && toggleQueue.some((s) => s.name === sub.name) ? !willAdd : willAdd;
  }, [result, sub.name, subs, toggleQueue]);

  const onClick = useCallback(() => {
    if (result) {
      dispatch(toggleResult(sub));
    } else {
      setSize('0');
      setTimeout(() => {
        dispatch(toggleSubreddit(sub));
      }, 200);
    }
  }, [dispatch, result, sub])

  return (
    <div onClick={onClick} style={{height: size, width: size, margin: size}} className={clsx('sub', {'result': result}, {'add': add}, 'noselect')}>
      <div style={{display: 'flex', maxWidth: '80%'}}>
        {/* Sub icon or default */}
        <img className='sr-icon' src={sub.icon_url || srdefault} alt="" />
        {/* Sub name & prefix */}
        <p className='sub-name'>
          <span className='sub-prefix'>r/</span>
          {sub.name}
        </p>
      </div>
      {/* Remove sub icon */}
      <button className="remove-sub">
        { add
          ? <BiAddToQueue className={'toggle-icon'} />
          : <CiTrash className={'toggle-icon'} />
        }
      </button>
    </div>
  );
}