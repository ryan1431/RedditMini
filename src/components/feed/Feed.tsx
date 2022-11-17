import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';
import { useFeed } from '../../app/hooks/useFeed';
import { useOnScreen } from '../../app/hooks/useOnScreen';
import { toggleOpen } from '../../app/reducers/subredditsSlice';
import { PostType } from '../../utility';
import { feedFields, sortFields } from '../../utility/data';
import Modal from '../ui/Modal';
import './Feed.css';
import { OpenPost } from './OpenPost';

import { Post } from './post/Post';

export const Feed = () => {
  const dispatch = useAppDispatch();

  const [selected, setSelected] = useState<string>('');
  const [openPost, setOpenPost] = useState<PostType | null>(null);
  const [fetchingLocal, setFetchingLocal] = useState<boolean>(true);

  const windowTimerRef = useRef<NodeJS.Timeout>();
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const resize = useCallback(() => {
    clearTimeout(windowTimerRef.current);
    windowTimerRef.current = setTimeout(() => {
      setWindowWidth(window.innerWidth);
    }, 100)
  }, []);
  
  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);
  
  
  const onOpenPost = useCallback((e:any) => {
    if (e.target instanceof HTMLVideoElement
      || (e.target && e.target.classList?.contains('info-save'))
      || !e.target.closest('.post')) 
        return setSelected('');
    
    setSelected(e.target.closest('.post').classList[1] || '');
  }, []);

  const onClosePost = useCallback(() => {
    setOpenPost(null);
    setSelected('');
  }, []);

  const visRef:any = useRef();
  const isVisible = useOnScreen(visRef);

  const fetching = useAppSelector((s) => s.query.fetching);
  const subs = useAppSelector((s) => s.subreddits.subs);
  const { feed, sort } = useAppSelector((s) => s.query);

  useEffect(() => {
    if (fetching) {
      setFetchingLocal(true);
    } else {
      setTimeout(() => {
        setFetchingLocal(false);
      }, 1000)
    }
  }, [fetching]);

  const {
    sortBy,
    savedPosts,
    userFeed,
  } = useFeed(isVisible);

  const disabled = feed === 'saved';

  return (
    <div id="feed" >
      {/* Open post modal */}
      <Modal open={!!openPost} onClose={onClosePost} closePrompt={windowWidth < 500}>
        {openPost && <OpenPost post={openPost} setOpenPost={setOpenPost} />}
      </Modal>
      
      {/* Customization buttons */}
      <section className='feed-customize' style={{cursor: 'pointer'}}>
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
      <section className='feed-posts' onClick={onOpenPost}>
        {(userFeed.length)
          ? userFeed.map((post: PostType) => {
            const clicked = selected === post.link;
            return <Post post={post} 
              key={'' + post.title + post.score + post.subreddit}
              clicked={clicked}
              setOpenPost={setOpenPost}/>;
          }) 
          : <div className='post' style={{textAlign: 'center'}}>
              {feed === 'custom' && !subs.length 
                  ? (
                  <div >
                    <p>You have not selected any subreddits. <span onClick={() => dispatch(toggleOpen())} className='open-subreddits'>Click here</span>  to add subreddits.</p>
                  </div>) : feed === 'saved' && !savedPosts.length
                  ? <p>You have not saved any posts!</p>
                : <p>Loading...</p>}
          </div>
        }

          {/* Infinite scroll visible trigger for home & custom feeds */}
        {<div ref={feed !== 'saved' ? visRef : null} style={{
            opacity: '0', 
            display: `${!fetchingLocal && userFeed.length && feed !== 'saved' ? 'block' : 'none'}`
            }}>invisibletext
          </div>
        }
      </section>
      

      
    </div>
  )
}         