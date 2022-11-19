import './OpenPost.css';
import { useEffect, useState } from 'react';
import { PostType } from '../../utility';
import { Post } from './post/Post';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';
import { fetchComments } from '../../app/reducers/commentsSlice';
import type { CommentData, CommentType, MoreComments } from '../../types/commentType';
import { Comment } from './Comment';
import { More } from './More';
interface OpenPostProps {
  post: PostType,
}

export const OpenPost = ({post}:  OpenPostProps) => {
  const dispatch = useAppDispatch();

  const commentsState = useAppSelector(s => s.comments.comments);
  const lastPostId = useAppSelector(s => s.comments.lastId);

  const [comments, setComments] = useState<CommentType[]>([]);

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
        
        {post.num_comments > 0 ? <div className='comment-wrapper'>
          {comments.length 
            ? comments.map((comment) => {
              return (comment.kind === 't1') 
                ? <Comment key={'Comment' + comment.data.id} comment={comment.data as CommentData} postId={post.name} sub={post.subreddit}/>
                : <More key={'More' + comment.data.id} data={comment.data as MoreComments} postId={post.name} sub={post.subreddit}/>
            })
            : <div>Loading comments...</div>}
        </div> : <div className='comment-wrapper'>No comments</div>}
        
      </div>}
    </div>
    
  )
}