import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CommentData, MoreComments } from '../../types/commentType';
import { base } from '../../utility/data';
import './Comment.css';
import { More } from './More';

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
  const [avatar, setAvatar] = useState<string>();

  useEffect(() => {
    setBounding(commentRef.current.getBoundingClientRect());
  }, [])
  
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setBounding(commentRef.current.getBoundingClientRect());

      }, 200)
    })
    resizeObserver.observe(commentRef.current);    
  }, []);

  useEffect(() => {
    comment.author !== '[deleted]' && fetch(`${base}user/${comment.author}/about.json?raw_json=1`)
      .then(res => res.json())
      .then(data => {
        setAvatar(data.data.snoovatar_img || data.data.icon_img);
      });
  }, [comment.author])

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
            {avatar && <img src={avatar} alt='user-avatar' className={clsx('user-avatar', {'snoovatar': avatar.includes('snoovatar')})}></img>}
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
        return (comment.kind === 't1')  
          ? <Comment comment={comment.data as CommentData} postId={postId} sub={sub}/>
          : <More data={comment.data as MoreComments} postId={postId} sub={sub} />
      })}
    </div>
  )
}