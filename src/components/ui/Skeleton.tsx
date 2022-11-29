import clsx from 'clsx';
import { useMemo } from 'react';
import './Skeleton.css';

interface SkeletonProps {
  className?: string,
  avatar?: boolean,
  bars?: number,
  mergeBars?: boolean,
}

export const Skeleton = ({className, avatar = false, bars = 4, mergeBars = false}: SkeletonProps) => {

  const skeletonBars = useMemo(() => {
    const sBars = [];

    for (let i = 0; i < bars; i++) {
      sBars.push(<div className='skeleton-bar'></div>)
    }

    return sBars;
  }, [bars]);
  
  return (
    <article className={`${className} skeleton`}>
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