import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';
import { useFeed } from '../../app/hooks/useFeed';
import { useOnScreen } from '../../app/hooks/useOnScreen';
import { hidePost, unHidePost } from '../../app/reducers/savedSlice';
import { toggleOpen, toggleSrOpen } from '../../app/reducers/subredditsSlice';
import { PostType } from '../../utility';
import { feedFields, sortFields } from '../../utility/data';
import { FeedIcons, feedIcons, SortIcons, sortIcons } from '../../utility/feedData';
import Modal from '../ui/Modal';
import { Snackbar } from '../ui/Snackbar';
import './Feed.css';
import { OpenPost } from './OpenPost';

import { Post } from './post/Post';

export const Feed = () => {
  const dispatch = useAppDispatch();

  const [selected, setSelected] = useState<string>('');
  const [openPost, setOpenPost] = useState<PostType | null>(null);
  const [fetchingLocal, setFetchingLocal] = useState<boolean>(true);
  const [snackbar, setSnackbar] = useState<string[]>([]);

  const onOpenPost = useCallback((e:any) => {
    if (e.target instanceof HTMLVideoElement
      || (e.target && e.target.classList?.contains('info-save'))
      || !e.target.closest('.post')
      || e.target.closest('.votes')
      || e.target.closest('.details-menu')) 
        return setSelected('');
    
    setSelected(e.target.closest('.post').classList[1] || '');
  }, []);

  const onClosePost = useCallback(() => {
    setOpenPost(null);
    setSelected('');
  }, []);

  const onOpenSubredditPanel = useCallback(() => {
    dispatch(toggleSrOpen(true));
    dispatch(toggleOpen())
  }, [dispatch]);

  const onHide = useCallback((name: string) => {
    setSnackbar(p => [...p, name]);
    dispatch(hidePost(name));
  }, [dispatch]);

  const visRef:any = useRef();
  const isVisible = useOnScreen(visRef);

  const fetching = useAppSelector((s) => s.query.fetching);
  const subs = useAppSelector((s) => s.subreddits.in_storage.subs);
  const { feed, sort } = useAppSelector((s) => s.query);
  const feedPosts = useAppSelector(s => s.query.feedPosts);

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
  } = useFeed(isVisible);

  useEffect(() => {
    console.log(feedPosts);
    // console.log('check')
  }, [feedPosts]);

  const disabled = feed === 'saved';

  return (
    <div id="feed" >
      {/* Open post modal */}
      <Modal open={!!openPost} onClose={onClosePost}>
        {openPost && <Modal.Header>
          <span className='sub-prefix' style={{marginRight: '2px'}}>r/</span>{openPost?.subreddit}
        </Modal.Header>}
        {openPost && <OpenPost post={openPost}/>}
      </Modal>
      
      {/* Feed & Sort by */}
      <section className='feed-customize' style={{cursor: 'pointer'}}>
        <div className="query-buttons">
          {sortFields.map(([field, title]) => {
            const Icon = sortIcons[field as keyof SortIcons];
            return (
              <div onClick={() => sortBy(['sort', field])} key={title} className={clsx('sort', { 'active': sort === field && !disabled, 'disabled': disabled })}>
                <Icon />
                <p>{title}</p>
              </div>
            )
          })}
        </div>
        <section className='feed-buttons'>
          {feedFields.map(([field, title]) => {
            const Icon = feedIcons[field as keyof FeedIcons];
            return (
              <div onClick={() => sortBy(['feed', field])} key={title} className={clsx('feed', { active: feed === field })}>
                <Icon />
                <p>{title}</p>
              </div>
            )
          }
          )}
        </section>
      </section>

      {/* Content */}
      <section className='feed-posts' onClick={onOpenPost}>
        {(feedPosts.length)
          ? feedPosts.map((post: PostType) => {
            const clicked = selected === post.link;
            return <Post post={post} 
              key={'' + post.title + post.score + post.subreddit}
              clicked={clicked}
              setOpenPost={setOpenPost}
              onHide={onHide}/>
          }) 
          : <div className='post' style={{textAlign: 'center'}}>
              {feed === 'custom' && !subs.length 
                  ? ( <div >
                    <p>You have not followed any subreddits.<span className='nav-mobile'><span onClick={onOpenSubredditPanel} className='open-subreddits'>Click here</span>  to add subreddits.</span></p>
                  </div>) 
                : feed === 'saved' && !savedPosts.length
                  ? <p>You have not saved any posts.</p>
                : <p>Loading...</p>}
          </div>
        }

        {/* Infinite scroll visible trigger for home & custom feeds */}
        {<div ref={feed !== 'saved' ? visRef : null} style={{
            opacity: '0', 
            display: `${!fetchingLocal && feedPosts.length && feed !== 'saved' ? 'block' : 'none'}`
            }}>invisibletext
          </div>
        }
      </section>

      <div className='snackbar-wrapper'>
        {snackbar.map(s => {

          return <Snackbar text='Post Hidden.' 
            actionText={'Undo'} 
            onAction={() => {
              dispatch(unHidePost(s));
              setSnackbar(p => p.filter(name => name !== s));
            }}
            actionCloses
            key={`snack-${s}`}
          />
        })}
      </div>     

      <div className='back-to-top'>
        <p><a href="#feed">Back to top</a></p>
      </div>
    </div>
  )
}         