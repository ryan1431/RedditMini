import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CommentData } from '../../types/commentType';
import './Comment.css';

interface CommentProps {
  comment: CommentData,
}

export const Comment = ({comment}: CommentProps) => {
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
            <Comment comment={comment.data as CommentData} />
          )

        // 'Show n more replies' or 'Continue thread' --> on reddit.com
        } else {
          return (
            <>

            </>
          )
        }
      })}
    </div>
  )
}