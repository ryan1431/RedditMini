import './Post.css';

import { PostType } from '../../../utility';
import { Video } from '.././post/Video';
import { TextBody } from '.././post/TextBody';
import { ImageBody } from '.././post/ImageBody';
import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { save, unsave } from '../../../app/reducers/savedSlice';
import { useAppSelector } from '../../../app/hooks/hooks';
import { getRelativeTime } from '../../../utility/getRelativeTime';
import { Votes } from './Votes';
import { Menu } from '../../ui/Menu';

import { BiHide } from 'react-icons/bi';
import { AiOutlineLink } from 'react-icons/ai';

interface PostProps { 
  post: PostType;
  open?: boolean;
  clicked?: boolean;
  setOpenPost?: React.Dispatch<React.SetStateAction<PostType | null>>;
}

export const Post = ({post, clicked, setOpenPost, open = false}: PostProps) => {
  const dispatch = useDispatch();

  const savedPosts = useAppSelector(s => s.saved.savedPosts);
  const saved = savedPosts.some(p => p.link === post.link);

  const onSave = useCallback(() => {
    if (saved) {
      dispatch(unsave(post));
    } else {
      dispatch(save(post));
    }
  }, [dispatch, post, saved]);

  useEffect(() => {
    if (clicked && setOpenPost) {
      setOpenPost(post);
    }
  }, [clicked, post, setOpenPost]);
  
  return (
    <>
      {post && (
      <article className={`post ${post.link}`}>
        {/* Subreddit & Poster Info */}
        <address className='details-wrapper'>
          <div className='details-left'>
            {!open && <p><a className='sub-link' href={`https://www.reddit.com/${post.subreddit_name_prefixed}`} rel='noreferrer' target={'_blank'}>r/{post.subreddit}</a></p>}
            <p className='post-details author'>
              {!open && <span>• </span>}
              <span className='name-prefix'>u/</span>{post.author}
            </p>
            <p className='post-details'>{getRelativeTime(post.created_utc * 1000)}</p>
          </div>
          <Menu className='details-menu'>
            <div className='menu-items-wrapper'>
              <div className='menu-item'>
                <p>Hide Post</p>
                <BiHide />
              </div>
              <div className='menu-item' onClick={() => window.open(post.link, '_blank')?.focus()}>
                <p>Open in Reddit</p>
                <AiOutlineLink />
              </div>
            </div>
          </Menu>
        </address>

        {/* Title */}
        <header className='post-title'>
          <h2>{post.title}</h2>
        </header>
        {/* Body */}
        <main className={`post-body ${post.type}`}>
          {
            post.type === 'video' ? <Video url={post.content_url}/>
            : post.type === 'image' ? <ImageBody url={post.content_url}/>
            : <TextBody selftext={post.selftext} selftext_html={post.selftext_html} />
          }
        </main>
        
        {/* Info / Actions */}
        <footer className='info'>
          <Votes score={post.score} />
          <p>{post.num_comments} comments</p>
          <button className='info-save' onClick={onSave}>{saved ? 'Unsave' : 'Save'}</button>
        </footer>
      </article>
      )}
    </> )
}