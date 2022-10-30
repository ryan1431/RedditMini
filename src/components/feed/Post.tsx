import './Post.css';

import { PostType } from '../../utility';
import { Video } from './body/Video';
import { TextBody } from './body/TextBody';
import { ImageBody } from './body/ImageBody';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { save, unsave } from '../../features/savedSlice';

interface PostProps { 
  post: PostType;
  savedPosts: string[]
  saved?: boolean;
}

export const Post = ({post, savedPosts, saved}: PostProps) => {

  const dispatch = useDispatch();

  // const isSaved = useMemo(() => savedPosts.includes(post.url), [savedPosts, post.url]);

  const handleSave = useCallback(() => {
    if (saved) {
      dispatch(unsave(`https://www.reddit.com${post.permalink}`));
    } else {
      dispatch(save(`https://www.reddit.com${post.permalink}`));
    }
  }, [dispatch, post.permalink, saved]);
  
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
        <button className='info-save' onClick={handleSave}>{saved ? 'Unsave' : 'Save'}</button>
      </footer>
    </article>
  )) || <></>
}