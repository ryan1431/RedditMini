import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CommentData, MoreComments } from '../../types/commentType';
import { base } from '../../utility/data';
import './Comment.css';

interface CommentProps {
  comment: CommentData,
  postId: string,
  sub: string,
}

export const Comment = ({comment, postId, sub}: CommentProps) => {
  const commentRef = useRef<HTMLDivElement>(undefined!);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const [bounding, setBounding] = useState<DOMRect>();
  const [showReplies, setShowReplies] = useState<boolean>(true);

  const onResize = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setBounding(commentRef.current.getBoundingClientRect());
    }, 100);
  }, []);
  
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [onResize]);
  
  useEffect(() => {
    setBounding(commentRef.current.getBoundingClientRect());
  }, []);

  const onCloseBar = useCallback(() => {
    setShowReplies(false);
  }, []);
  
  return (
    // Tree
    <div className='comment-chain' >

      {/* Comment */}
      <div className={clsx('comment', { 'mod-comment': comment.distinguished === 'moderator'})}
        style={{marginLeft: 10 + (comment.depth * 15)}}  
        ref={commentRef}
      >
        <div className='comment-bar'>
          {/* Left */}
          <div>
            <p>
              <span className='name-prefix'>u/</span>
              {comment.author}
              {comment.distinguished === 'moderator' && <span className='moderator'>MOD</span>}
            </p>
          </div>
          {/* Right */}
          <div>
          </div>
        </div>
        <div className='comment-content'
          dangerouslySetInnerHTML={{__html: comment.body_html}}>
        </div>
        <div className='comment-actions'>
          {/* Left */}
          <div style={{display: 'flex'}}>
            <p>{comment.score}</p>
          </div>
          {/* Right */}
          <div>
            
          </div>
        </div>
      </div>
      

      {/* Close chain bar */}
      {comment.replies 
        && <div className='comment-chain-close'
          onClick={onCloseBar}
          style={{
            height: `calc(100% - ${bounding && bounding.height}px - 10px)`,
            left: `${7 + (comment.depth * 15)}px`,
          }}
        >
          <div></div> {/* inner bar */}
        </div> }

      {/* Replies */}
      {comment.replies && showReplies && comment.replies.map((comment) => {
        if (comment.kind === 't1') { 
          return (
            <Comment comment={comment.data as CommentData} postId={postId} sub={sub}/>
          )

        // 'Show n more replies' or 'Continue thread' --> on reddit.com
        } else {
          let data = comment.data as MoreComments;

          let link = `${base}r/${sub}/comments/${postId.slice(3)}`
          if (data.parent_id[1] === '1') link += `/comment/${data.parent_id.slice(3)}`
          return (
            <div className='comment-see-more'
              style={{
                left: `${7 + (data.depth * 15)}px`,
              }}  
            >
              {data.count ? (
                <p><a href={link} target='_blank' rel='noreferrer'>{data.count} more repl{data.count === 1 ? 'y' : 'ies'} - view on reddit.com</a></p>
              ) : (
                <p><a href={link} target='_blank' rel='noreferrer'>continue thread on reddit.com</a></p>
              )}
            </div>
          )
        }
      })}
    </div>
  )
}