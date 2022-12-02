import clsx from 'clsx'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';
import { useClickout } from '../../app/hooks/useClickout';
import { useFeed } from '../../app/hooks/useFeed';
import { useOnScreen } from '../../app/hooks/useOnScreen';
import { hidePost, selectTheme, unHidePost } from '../../app/reducers/savedSlice';
import { toggleOpen, toggleSrOpen } from '../../app/reducers/subredditsSlice';
import { SubMeta } from '../../types';
import { PostType } from '../../utility';
import { feedFields, sortFields } from '../../utility/data';
import { FeedIcons, feedIcons, SortIcons, sortIcons } from '../../utility/feedData';
import LRU from '../../utility/LRU';
import Modal from '../ui/Modal';
import { Skeleton } from '../ui/Skeleton';
import { Snackbar } from '../ui/Snackbar';
import './Feed.css';
import { OpenPost } from './OpenPost';

import { Post } from './post/Post';

import defaultIcon from '../../media/srdefault.jpeg';
import { getRGBA } from '../../utility/getRGBA';


export interface SelectedPostData {
  post: PostType,
  subMeta: SubMeta | undefined,
}


export const Feed = () => {
  const dispatch = useAppDispatch();

  const [selected, setSelected] = useState<string>('');
  const [selectedPostData, setSelectedPostData] = useState<SelectedPostData | null>(null);
  const [fetchingLocal, setFetchingLocal] = useState<boolean>(true);
  const [snackbar, setSnackbar] = useState<string[]>([]);

  const SubDataLRU = useMemo<LRU<string, SubMeta>>(() => {
    return new LRU<string, SubMeta>(30);
  }, []);

  const onOpenPost = useCallback((e:any) => {
    if (e.target.classList.contains('nsfw-unblur')) return;
    
    if (e.target instanceof HTMLVideoElement
      || (e.target && e.target.classList?.contains('info-save'))
      || !e.target.closest('.post')
      || ['.info-save', '.votes', '.details-menu', '.post-sub-details', '.slide-wrapper'].some(s => e.target.closest(s))) 
      return setSelected('');
    
    setSelected(e.target.closest('.post').classList[1] || '');
  }, []);

  const onClosePost = useCallback(() => {
    setSelectedPostData(null);
    setSelected('');
  }, []);


  const focusSearch = useCallback(() => {
    (document.querySelectorAll('.search') as NodeListOf<HTMLInputElement>)[1]!.focus();;
  }, []);
  
  const onOpenSubMobile = useCallback(() => {
    dispatch(toggleSrOpen(true));
    dispatch(toggleOpen());

    focusSearch();
    (document.querySelector('.search') as HTMLInputElement).focus();
  }, [dispatch, focusSearch]);

  const onHide = useCallback((name: string) => {
    setSnackbar(p => [...p, name]);
    dispatch(hidePost(name));
  }, [dispatch]);

  const onCopyLink = useCallback((link: string) => {
    navigator.clipboard.writeText(link);

    setSnackbar(p => [...p, `clipboard-${link}`]);
  }, []);

  const visRef:any = useRef();
  const isVisible = useOnScreen(visRef);

  const fetching = useAppSelector((s) => s.query.fetching);
  const subs = useAppSelector((s) => s.subreddits.in_storage.subs);
  const { feed, sort } = useAppSelector((s) => s.query);
  const feedPosts = useAppSelector(s => s.query.feedPosts);
  const theme = useAppSelector(selectTheme);
  const bName = useAppSelector(s => s.saved.background);

  const textColor = getRGBA(theme.text);
  const background = getRGBA(theme.front, bName !== 'Default' ? 0.8 : 0.6);
  const backgroundAlt = getRGBA(theme.back_alt);
  const borderColor = getRGBA(theme.border, 0.8);
  const borderRightColor = getRGBA(theme.border, 0.5);

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

  const disabled = feed === 'saved';


  const [clickedMenu, setClickedMenu] = useState<string>('');
  const onClick = useCallback((e: any) => {
    // Force out
    if (['.menu-item'].some(s => !!e.target.closest(s))) {
      setClickedMenu('');
      return;
    }

    // Clicks in menu
    if (['.ui-menu'].some(s => !!e.target.closest(s))) return;

    // Clicks outside menu
    setClickedMenu('');
  }, []);
  
  useClickout(onClick);

  return (
    <div id="feed" >
      {/* Open post modal */}
      <Modal open={!!selectedPostData} onClose={onClosePost}>
        {selectedPostData && <Modal.Header>
          <img className='post-sub-img' src={selectedPostData?.subMeta?.community_icon || selectedPostData?.subMeta?.icon_img || defaultIcon} alt='subreddit icon'></img>
          <span className='sub-prefix' style={{margin: '0 2px 0 6px'}}>r/</span>{selectedPostData?.post.subreddit}
        </Modal.Header>}
        {selectedPostData && 
          <OpenPost 
            setClickedMenu={setClickedMenu} 
            menuOpen={clickedMenu === selectedPostData.post.link} 
            data={selectedPostData} 
            SubDataLRU={SubDataLRU}
          />}
      </Modal>
      
      {/* Feed & Sort by */}
      <section className='feed-customize' style={{cursor: 'pointer'}}>
        <div className="query-buttons" 
          style={{
            background, borderColor,
            width: 'calc(100% - 1px)',
          }}
        >
          {sortFields.map(([field, title]) => {
            const Icon = sortIcons[field as keyof SortIcons];
            return (
              <div onClick={() => sortBy(['sort', field])} 
                key={title} 
                style={{borderRightColor}}
                className={clsx('sort', { 'active': sort === field && !disabled, 'disabled': disabled })}>
                <Icon />
                <p>{title}</p>
              </div>
            )
          })}
        </div>
        <section className='feed-buttons' style={{background, borderColor}}>
          {feedFields.map(([field, title]) => {
            const Icon = feedIcons[field as keyof FeedIcons];
            return (
              <div onClick={() => sortBy(['feed', field])} 
                key={title} 
                style={{borderRightColor}}
                className={clsx('feed', { active: feed === field })}>
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
              setClickedMenu={setClickedMenu}
              menuOpen={clickedMenu === post.link}
              key={'' + post.title + post.score + post.subreddit}
              clicked={clicked}
              setSelectedPostData={setSelectedPostData}
              onHide={onHide}
              onCopyLink={onCopyLink}
              SubDataLRU={SubDataLRU}/>
          }) 
          : feed === 'custom' && !subs.length 
          ? <div className='post' style={{textAlign: 'center', background}}>
              <p>You have not followed any subreddits. 
                  <span onClick={onOpenSubMobile} className='open-subreddits mobile'>
                    Click here to search.
                  </span>  
                  <span onClick={focusSearch} className='open-subreddits desktop'>
                    Click here to search.
                  </span> 
              </p>
            </div>
          : feed === 'saved' && !savedPosts.length
            ? <div className='post' style={{textAlign: 'center', background}}>
                <p>You have not saved any posts.</p>
              </div>
          : <>
            <Skeleton className='post' avatar mergeBars bars={12}/>
            <Skeleton className='post' avatar mergeBars bars={12}/>
            <Skeleton className='post' avatar mergeBars bars={12}/>
            <Skeleton className='post' avatar mergeBars bars={12}/>
          </>
          }

        {fetching && <>
            <Skeleton className='post' avatar mergeBars bars={12}/>
            <Skeleton className='post' avatar mergeBars bars={12}/>
            <Skeleton className='post' avatar mergeBars bars={12}/>
            <Skeleton className='post' avatar mergeBars bars={12}/>
        </>}

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
          if (s.includes('clipboard-')) {
            return <Snackbar text='Copied to Clipboard.' 
              key={`snack-${s}`}  
            />
          }

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

      <div className='back-to-top' style={{borderColor, background: backgroundAlt}}>
        <p><a style={{color: textColor}} href="#feed">Back to top</a></p>
      </div>
    </div>
  )
}         