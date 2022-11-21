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

interface PostProps { 
  post: PostType;
  clicked?: boolean;
  setOpenPost?: React.Dispatch<React.SetStateAction<PostType | null>>;
}

export const Post = ({post, clicked, setOpenPost}: PostProps) => {
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
        <address style={{ display: 'flex', alignItems: 'flex-end'}}>
          <p>
            <a className='sub-link' href={`https://www.reddit.com/${post.subreddit_name_prefixed}`} rel='noreferrer' target={'_blank'}>r/{post.subreddit}</a>
          </p>
          <p className='post-details'>
            posted by <span className='name-prefix'>u/</span>{post.author}
          </p>
          <p className='post-details'>{getRelativeTime(post.created_utc * 1000)}</p>
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
          <p><a href={post.link}>link</a></p>
          <p>{post.num_comments} comments</p>
          <button className='info-save' onClick={onSave}>{saved ? 'Unsave' : 'Save'}</button>
        </footer>
      </article>
      )}
    </> )
}