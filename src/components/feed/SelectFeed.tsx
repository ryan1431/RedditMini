import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';
import { clearCachedPosts, setAdd, setQuery } from '../../app/reducers/querySlice';
import { selectTheme } from '../../app/reducers/savedSlice';
import { feedIcons, feedOptions } from '../../utility/feedData';
import { getRGBA } from '../../utility/getRGBA';
import './SelectFeed.css';

interface SelectFeedProps {
  open: boolean,
  onClose: (...args: any) => any,
}

export const SelectFeed = ({open, onClose}: SelectFeedProps) => {
  const dispatch = useAppDispatch();
  
  const wrapperRef = useRef<HTMLDivElement>(undefined!);

  const theme = useAppSelector(selectTheme);
  const bName = useAppSelector(s => s.saved.background);
  const background = getRGBA(theme.front, bName !== 'Default' ? 0.8 : 1);
  const borderColor = getRGBA(theme.border);

  const onClick = useCallback((e: any) => {
    if (wrapperRef.current.contains(e.target)
      || e.target.closest('.feed-select')) 
    return;
    
    onClose();
  }, [onClose]);

  const onSetFeed = useCallback((feed: string) => {
    document.getElementById('feed-wrapper')!.scrollTo(0,0);
    dispatch(setAdd(false));
    dispatch(clearCachedPosts());
    dispatch(setQuery(['after', '']));
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
      style={{background, borderColor}}
    >
      {feedOptions.map((feed) => {
        const FeedIcon = feedIcons[feed];
        return <div 
          key={'select-' + feed} 
          className='icon-wrapper' 
          onClick={() => onSetFeed(feed)}
          style={{borderBottomColor: borderColor}}
        >
          <FeedIcon />
          <p style={{textTransform: 'capitalize'}}>{feed === 'custom' ? 'Following' : feed}</p>
        </div>
      })}
      
    </div>
  )
}