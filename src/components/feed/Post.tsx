import './Post.css';

import type { PostType } from '../../utility';

export interface PostProps {
  post: PostType
}


export const Post = (props: PostProps) => {

  const { post } = props;

  return (
    <>
      <div id="post" >
        <h3>{post.title}</h3>
        <p>{post.selftext}</p>
      </div>

    </>
  )
}

// style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}