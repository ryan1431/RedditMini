import clsx from 'clsx';
import { useMemo } from 'react';
import { useAppSelector } from '../../app/hooks/hooks';
import { selectTheme } from '../../app/reducers/savedSlice';
import { getRGBA } from '../../utility/getRGBA';
import './Skeleton.css';

interface SkeletonProps {
  className?: string,
  avatar?: boolean,
  bars?: number,
  mergeBars?: boolean,
}

export const Skeleton = ({className, avatar = false, bars = 4, mergeBars = false}: SkeletonProps) => {
  const theme = useAppSelector(selectTheme);
  const background = getRGBA(theme.front, 0.6);

  const skeletonBars = useMemo(() => {
    const sBars = [];

    for (let i = 0; i < bars; i++) {
      sBars.push(<div key={`skelebar-${Date.now()}-${i}`} className='skeleton-bar'></div>)
    }

    return sBars;
  }, [bars]);
  
  return (
    <article className={`${className} skeleton`} style={{background}}>
      {/* Subreddit & Poster Info */}
      {avatar && <address className='skeleton-avatar'>
        <div className='skeleton-circle'></div>
        <div style={{width: '100%'}}>
          <div className='skeleton-bar'></div>
        </div>
      </address>}

      <div className={clsx({'merge': mergeBars})}>
        {skeletonBars}
      </div>
    </article>
  )
}