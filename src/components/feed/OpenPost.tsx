import './OpenPost.css';
import React from 'react';
import { PostType } from '../../utility';
import { Post } from './Post';

interface OpenPostProps {
  post: PostType | null,
  setOpenPost: React.Dispatch<React.SetStateAction<PostType | null>>,
}

export const OpenPost = ({post, setOpenPost}:  OpenPostProps) => {

  return (
    <>
      {post && <div className='open-post'>
        <Post post={post}/>

        {/* <Comments /> */}
        
      </div>}
    </>
    
  )
}