import './OpenPost.css';
import { useEffect, useState } from 'react';
import { PostType } from '../../utility';
import { Post } from './post/Post';
import { useAppDispatch, useAppSelector } from '../../app/hooks/hooks';
import { fetchComments } from '../../app/reducers/commentsSlice';
import type { CommentData, CommentType, MoreComments } from '../../types/commentType';
import { Comment } from './Comment';
import { base } from '../../utility/data';
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
        
        {post.num_comments > 0 ? <div className='comment-wrapper'>
          {comments.length 
            ? comments.map((comment) => {
              if (comment.kind === 't1') {
                return <Comment comment={comment.data as CommentData} postId={post.name} sub={post.subreddit}/>
              } else {
                let data = comment.data as MoreComments;

                let link = `${base}r/${post.subreddit}/comments/${post.name.slice(3)}`
                if (data.parent_id[1] === '1') link += `/comment/${data.parent_id.slice(3)}`
                return (
                  <div className='comment-see-more'
                    style={{
                      left: `${7 + (data.depth * 15)}px`,
                      marginTop: '20px',
                    }}  
                  >
                    <p><a href={link} target='_blank' rel='noreferrer'>+{data.count} more repl{data.count === 1 ? 'y' : 'ies'} - view on reddit.com</a></p>
                  </div>
                )
              }
            })
            : <div>Loading comments...</div>}
        </div> : <div className='comment-wrapper'>No comments</div>}
        
      </div>}
    </div>
    
  )
}