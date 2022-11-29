import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';
import { setQuery } from '../../app/reducers/querySlice';
import { currentThemeInfo } from '../../app/reducers/savedSlice';
import { feedIcons, feedOptions } from '../../utility/feedData';
import './SelectFeed.css';

interface SelectFeedProps {
  open: boolean,
  onClose: (...args: any) => any,
}

export const SelectFeed = ({open, onClose}: SelectFeedProps) => {
  const dispatch = useAppDispatch();
  
  const wrapperRef = useRef<HTMLDivElement>(undefined!);

  const theme = useAppSelector(currentThemeInfo);
  const {r, g, b} = theme.front;

  const onClick = useCallback((e: any) => {
    if (wrapperRef.current.contains(e.target)
      || e.target.closest('.feed-select')) 
    return;
    
    onClose();
  }, [onClose]);

  const onSetFeed = useCallback((feed: string) => {
    dispatch(setQuery(['feed', feed]));
    onClose();
  }, [dispatch, onClose]);
  
  useEffect(() => {
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick);
  }, [onClick]);

  return (
    <div className={`nav-select-feed ${open ? 'nsf-open' : ''}`}
      ref={wrapperRef}
      style={{background: `rgb(${r}, ${g}, ${b})`}}
    >
      {feedOptions.map((feed) => {
        const FeedIcon = feedIcons[feed];
        return <div key={'select-' + feed} className='icon-wrapper' onClick={() => onSetFeed(feed)}>
          <FeedIcon />
          <p style={{textTransform: 'capitalize'}}>{feed === 'custom' ? 'Following' : feed}</p>
        </div>
      })}
      
    </div>
  )
}