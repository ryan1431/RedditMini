import clsx from 'clsx'
import { useRef } from 'react';
import { useAppSelector } from '../../app/hooks/hooks';
import { useFeed } from '../../app/hooks/useFeed';
import { useOnScreen } from '../../app/hooks/useOnScreen';
import { feedFields, sortFields } from '../../utility/data';
import './Feed.css';

import { Post } from './Post';

export const Feed = () => {
  const visRef:any = useRef();
  const isVisible = useOnScreen(visRef);
  
  const feedPosts = useAppSelector((s) => s.query.feedPosts);
  const fetching = useAppSelector((s) => s.query.fetching);

  const { feed, sort } = useAppSelector((s) => s.query);

  const {
    sortBy,
    savedPosts,
  } = useFeed(isVisible);

  const disabled = feed === 'saved';

  return (
    <div id="feed">
      {/* Customization buttons */}
      <section className='post'>
        <div className="query-buttons">
          {sortFields.map(([field, title]) => (
            <button onClick={sortBy} key={title} className={clsx('sort', { 'active': sort === field && !disabled, 'disabled': disabled })} value={field}>{title}</button>
          ))}
        </div>
        <footer className='feed-buttons'>
          {feedFields.map(([field, title]) => (
            <button onClick={sortBy} key={title} className={clsx('feed', { active: feed === field })} value={field}>{title}</button>
          ))}
        </footer>
      </section>

      {/* Content */}
      {(feedPosts.length)
        ? feedPosts.map((post: any) => {
          return <Post post={post} saved={!!savedPosts.find((p) => p.url === post.url)} key={'' + post.title + post.score + post.subreddit}/>;
        }) 
        : <div className='post'>
            <p style={{display: 'flex', justifyContent: 'center'}}>{fetching ? 'Loading...' : 'There are no posts to display!'}</p>
        </div>
      }

      {/* Infinite scroll visible trigger for home & custom feeds */}
      {<div ref={feed !== 'saved' ? visRef : null} style={{
          opacity: '0', 
          display: `${!fetching && feedPosts.length && feed !== 'saved' ? 'block' : 'none'}`}}>invisibletext
        </div>
      }
    </div>
  )
}         