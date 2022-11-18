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
  
  return (
    // Tree
    <div className='comment-chain' >

      {/* Comment */}
      <div 
        className={`comment depth-${comment.depth}`} 
        dangerouslySetInnerHTML={{__html: comment.body_html}} 
        style={{marginLeft: 10 + (comment.depth * 15)}}  
        ref={commentRef}
      />

      {/* Close chain bar */}
      {comment.replies 
        && <div className='comment-chain-close'
          style={{
            height: `calc(100% - ${bounding && bounding.height}px - 10px)`,
            left: `${7 + (comment.depth * 15)}px`,
          }}
        >
          <div></div> {/* inner bar */}
        </div> }

      {/* Replies */}
      {comment.replies && comment.replies.map((comment) => {
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