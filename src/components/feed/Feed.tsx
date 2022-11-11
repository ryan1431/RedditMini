import clsx from 'clsx'
import { useRef, useState } from 'react';
import { useFeed } from '../../app/hooks/useFeed';
import { useOnScreen } from '../../app/hooks/useOnScreen';
import { PostType } from '../../utility';
import { feedFields, sortFields } from '../../utility/data';
import './Feed.css';

import { Post } from './Post';

export const Feed = () => {
  const visRef:any = useRef();
  const isVisible = useOnScreen(visRef)
  const [feedPosts, setFeedPosts] = useState<PostType[]>([]);
  
  const {
    sortBy,
    savedPosts,
    loading,
    feed,
    feedField,
    sortField,
  } = useFeed(setFeedPosts, isVisible);

  return (
    <div id="feed">
      {/* Customization buttons */}
      <section className='post'>
        <div className="query-buttons">
          {sortFields.map(([field, title]) => (
            <button onClick={sortBy} key={title} className={clsx('sort', { active: sortField === field })} value={field}>{title}</button>
          ))}
        </div>
        <footer className='feed-buttons'>
          {feedFields.map(([field, title]) => (
            <button onClick={sortBy} key={title} className={clsx('feed', { active: feedField === field })} value={field}>{title}</button>
          ))}
        </footer>
      </section>

      {/* Content */}
      {(feedPosts.length)
        ? feedPosts.map((post: any) => {
          return <Post post={post} savedPosts={savedPosts} saved={savedPosts.includes(post.link)} key={'' + post.title + post.score + post.subreddit}/>;
        }) 
        : <div className='post'>
            <p style={{display: 'flex', justifyContent: 'center'}}>{loading ? 'Loading...' : 'There are no posts to display!'}</p>
        </div>
      }

      {/* Infinite scroll visible trigger for home & custom feeds */}
      {feed !== 'saved' && <div ref={visRef} style={{
          opacity: '0', 
          display: `${!loading && feedPosts.length && feed !== 'saved' ? 'block' : 'none'}`}}>invisibletext
        </div>
      }
    </div>
  )
}         