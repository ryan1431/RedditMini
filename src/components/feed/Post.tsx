import './Post.css';

import { fetchData, formatJsonResponse, formatUrl, PostType } from '../../utility';
import { useEffect, useState } from 'react';

export interface PostProps {
  postUrl: string,
}

export const Post = (props: PostProps) => {
  const { postUrl } = props;

  const [data, setData] = useState<any>();

  useEffect(() => {
    fetchData(formatUrl(postUrl))
    .then((res) => {
      const post = formatJsonResponse(res);
      setData({ ...post.post });
      console.log(data);
    })
    .catch((err) => {
      console.log(err)
    })
  }, []);
  
  return data && (
    <div className="card" >
      <div className='post'>
        <h3 className='title'>{data.title}</h3>
        <p>{data.selftext}</p>
      </div>
      <div className='info'>
        <p>{data.score} score</p>
        <p>{data.num_comments} comments</p>
      </div>
    </div>
  )
}
