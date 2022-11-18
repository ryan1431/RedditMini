import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { CommentData } from '../../types/commentType';
import './Comment.css';

interface CommentProps {
  comment: CommentData,
}

export const Comment = ({comment}: CommentProps) => {

  const commentRef = useRef<HTMLDivElement>(undefined!);
  const [bounding, setBounding] = useState<DOMRect>();

  useEffect(() => {
    setBounding(commentRef.current.getBoundingClientRect());
  }, []);
  
  return (
    // Tree
    <div className={clsx({'comment-chain': true})} >

      {/* Comment */}
      <div 
        className={`comment depth-${comment.depth}`} 
        dangerouslySetInnerHTML={{__html: comment.body_html}} 
        style={{marginLeft: 10 + (comment.depth * 15)}}  
        ref={commentRef}
      />

      {/* Close chain bar */}
      {comment.replies && <div className='comment-chain-close'
        style={{
          height: `calc(100% - ${bounding && bounding.height}px - 10px)`,
          left: `${11 + (comment.depth * 15)}px`,
        }}
      ></div> }

      {/* Replies */}
      {comment.replies && comment.replies.map((comment) => {
        if (comment.kind === 't1') { 
          return (
            <Comment comment={comment.data as CommentData} />
          )

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