import './Post.css';

import { fetchData, formatPost, formatUrl } from '../../utility';
import { useEffect, useState } from 'react';
import { Video } from './Video';

export interface PostProps {
  postUrl: string,
}

export const Post = (props: PostProps) => {
  const { postUrl } = props;

  const [post, setPost] = useState<any>();

  useEffect(() => {
    fetchData(formatUrl(postUrl))
    .then((res) => {
      const post = formatPost(res);
      post.is_video = !!post.preview;
      setPost(post);
      console.log(post);
    })
    .catch((err) => {
      console.log(err)
    })
  }, []);
  
  return post && (
    <div className="card" >
      <div className={post.is_video ? 'video-post' : 'post'}>
        <h3 className='title'>{post.title}</h3>
        { post.is_video ? (
          <video loop={true} controls>
            <source src={post.preview.images[0].variants.mp4.source.url}/>
          </video>
        ) : (
          <p>{post.selftext}</p>
        )}        
      </div>
      <div className='info'>
        <p>{post.score} score</p>
        <p>{post.num_comments} comments</p>
      </div>
    </div>
  )
}
