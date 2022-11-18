import './OpenPost.css';
import React, { useEffect, useState } from 'react';
import { PostType } from '../../utility';
import { Post } from './post/Post';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';
import { fetchComments } from '../../app/reducers/commentsSlice';
import type { CommentData, CommentType } from '../../types/commentType';
import { Comment } from './Comment';
import clsx from 'clsx';

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

  const renderCommentsRecurse = (comments: CommentType[]) => {

    
    return (
      <>
        {comments.map((comment) => {
          if (comment.kind === 't1') {
            let data = comment.data as CommentData;
            let id = `depth-${data.depth}_${data.id}`;
            return (
              <div className={clsx({'comment-chain': !data.depth})}>
                
                <div id={id}>
                  <Comment key={data.id} comment={data} />
                </div>
                {!data.depth && data.replies.length && <div className='comment-chain-close'
                  style={{
                    height: `calc(100% - ${document.querySelector(`#${id}`)?.getBoundingClientRect().height}px - 10px)`
                  }}
                ></div> }

                {data.replies && renderCommentsRecurse(data.replies)}

              </div>
            )

            // 'Show more' or 'Continue thread' on reddit.com...
          } else {
            return (
              <>
              
              </>
            )
          }
        })}
      </>
    ) 
  }

  return (
    <div style={{position: 'relative'}}>
      {post && <div className='open-post'>
        <Post post={post}/>
        
        <div className='comment-wrapper'>
          {comments.length 
            ? renderCommentsRecurse(comments)
            : <div>Loading comments...</div>}
        </div>
        
      </div>}
    </div>
    
  )
}