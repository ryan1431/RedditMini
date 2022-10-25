import './Post.css';

import { PostType } from '../../utility';
import { Video } from './body/Video';
import { TextBody } from './body/TextBody';
import { ImageBody } from './body/ImageBody';

interface PostProps { 
  post: PostType;
}

export const Post = ({post}: PostProps) => {
  
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
      </footer>
    </article>
  )) || <></>
}