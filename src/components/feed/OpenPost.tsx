import './OpenPost.css';
import { useEffect, useState } from 'react';
import { PostType } from '../../utility';
import { Post } from './post/Post';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';
import { fetchComments } from '../../app/reducers/commentsSlice';
import type { CommentData, CommentType } from '../../types/commentType';
import { Comment } from './Comment';
interface OpenPostProps {
  post: PostType,
}

export const OpenPost = ({post}:  OpenPostProps) => {
  const dispatch = useAppDispatch();

  const commentsState = useAppSelector(s => s.comments.comments);
  const lastPostId = useAppSelector(s => s.comments.lastId);

  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {console.log(comments)}, [comments]);

  useEffect(() => {
    if (post.name === lastPostId) {
      if (!comments.length && commentsState.length) setComments(commentsState);
      return;
    };
    dispatch(fetchComments({ url: post.link, postId: post.name}))
  }, [comments, commentsState, dispatch, lastPostId, post.link, post.name]);

  

  return (
    <div style={{position: 'relative'}}>
      {post && <div className='open-post'>
        <Post post={post}/>
        
        <div className='comment-wrapper'>
          {comments.length 
            ? comments.map((comment) => {
              if (comment.kind === 't1') {
                return <Comment comment={comment.data as CommentData} />
              } else {
                return <></>
              }
            })
            : <div>Loading comments...</div>}
        </div>
        
      </div>}
    </div>
    
  )
}