import './Post.css';

import { fetchData, formatPost, formatUrl, PostType, setType } from '../../utility';
import { useEffect, useRef, useState } from 'react';
import { Video } from './body/Video';
import { TextBody } from './body/TextBody';
import { ImageBody } from './body/ImageBody';

interface PostProps { 
  postUrl: string;
}

export const Post = ({postUrl}: PostProps) => {

  const [post, setPost] = useState<PostType>();

  useEffect(() => {
    fetchData(formatUrl(postUrl))
    .then((res) => {
      // Format reddit's post object model
      const post = formatPost(res);

      // if (!post.is_valid) return;

      console.log(post.type);
      setPost(post);
    })
    .catch((err) => {
      console.log(err)
    })
  }, []);
  
  return (post && (
    <article className="post">
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
        <p>{post.num_comments} comments</p>
      </footer>
    </article>
  )) || <></>
}