import './Post.css';

import { PostType } from '../../utility';
import { Video } from './body/Video';
import { TextBody } from './body/TextBody';
import { ImageBody } from './body/ImageBody';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { save, selectSaved, unsave } from '../../features/savedSlice';
import { useAppSelector } from '../../app/hooks/hooks';

interface PostProps { 
  post: PostType;
  toggleSaved: (post: PostType) => void;
}

export const Post = ({post, toggleSaved}: PostProps) => {

  const dispatch = useDispatch();
  const savedPosts = useAppSelector(selectSaved);

  const isSaved = useMemo(() => savedPosts.includes(post.url), [savedPosts, post.url]);

  const handleSave = useCallback(() => {
    if (isSaved) {
      dispatch(unsave(`https://www.reddit.com${post.permalink}`));
    } else {
      dispatch(save(`https://www.reddit.com${post.permalink}`));
    }
    toggleSaved(post);
  }, [dispatch, post, toggleSaved]);
  
  return (post && (
    <article className="post">
      {/* Subreddit & Poster Info */}
      <address>
        <p><a className='sub-link' href={`https://www.reddit.com/${post.subreddit_name_prefixed}`} rel='noreferrer' target={'_blank'}>/r/{post.subreddit}</a></p>
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
        <p>{post.score} score</p>
        <p>type: {post.type}</p>
        <p><a href={`https://www.reddit.com${post.permalink}`} rel='noreferrer' target='_blank'>link to reddit post</a></p>
        <p>{post.num_comments} comments</p>
        <button className='info-save' onClick={handleSave}>{isSaved ? 'Unsave' : 'Save'}</button>
      </footer>
    </article>
  )) || <></>
}