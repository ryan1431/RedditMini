import './OpenPost.css';
import React, { useEffect, useState } from 'react';
import { PostType } from '../../utility';
import { Post } from './post/Post';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';
import { fetchComments } from '../../app/reducers/commentsSlice';
import { Comment } from '../../types/commentType';

interface OpenPostProps {
  post: PostType,
  setOpenPost: React.Dispatch<React.SetStateAction<PostType | null>>,
}

export const OpenPost = ({post, setOpenPost}:  OpenPostProps) => {
  const dispatch = useAppDispatch();

  const commentsState = useAppSelector(s => s.comments.comments);
  const lastPostId = useAppSelector(s => s.comments.lastId);

  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (post.name === lastPostId) {
      if (!comments.length && commentsState.length) setComments(commentsState);
      return;
    };
    dispatch(fetchComments({ url: post.link, postId: post.name}))
  }, [comments, commentsState, dispatch, lastPostId, post.link, post.name]);

  return (
    <>
      {post && <div className='open-post'>
        <Post post={post}/>

        
      </div>}
    </>
    
  )
}