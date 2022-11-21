import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useDynamicTransition } from '../../app/hooks/useDynamicTransition';
import { CommentData, MoreComments } from '../../types/commentType';
import { base } from '../../utility/data';
import { getRelativeTime } from '../../utility/getRelativeTime';
import './Comment.css';
import { More } from './More';
import { Votes } from './post/Votes';

interface CommentProps {
  comment: CommentData,
  postId: string,
  sub: string,
}

export const Comment = ({comment, postId, sub}: CommentProps) => {
  const wrapperRef = useRef<HTMLDivElement>(undefined!);
  const commentRef = useRef<HTMLDivElement>(undefined!);

  const [avatar, setAvatar] = useState<string>();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  
  const { onToggle, maxHeightRef } = useDynamicTransition(wrapperRef, 250);
  const { onToggle: onToggleComment, maxHeightRef: maxCommentHeight, showReplies} = useDynamicTransition(commentRef, 250);
  
  const collapsedTimeoutRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    clearTimeout(collapsedTimeoutRef.current);
    collapsedTimeoutRef.current = setTimeout(() => {
      setCollapsed(!showReplies);
    }, 500);
  }, [showReplies]);

  useEffect(() => {
    comment.author !== '[deleted]' && fetch(`${base}user/${comment.author}/about.json?raw_json=1`)
      .then(res => res.json())
      .then(data => {
        setAvatar(data.data.snoovatar_img || data.data.icon_img);
      });
  }, [comment.author])
  
  return (
    // Tree
    <div className='comment-chain' ref={wrapperRef}>

      {/* Comment */}
      <div className={clsx('comment', { 'mod-comment': comment.distinguished === 'moderator'})}
        style={{marginLeft: 8 + (comment.depth * 20)}}  
      >
        {/* Top Bar (username, posted time) */}
        <div className='comment-bar'>
          {/* Left */}
          <div>
            {avatar && <img src={avatar} alt='user-avatar' className={clsx('user-avatar', {'snoovatar': avatar.includes('snoovatar')})}></img>}
            <p>
              <span className='name-prefix'>u/</span>
              {comment.author}
              {comment.distinguished === 'moderator' && <span className='moderator'>MOD</span>}
            </p>
            <p className='comment-details'>{getRelativeTime(comment.created_utc * 1000)}</p>

          </div>
          {/* Right */}
          <div>
          </div>
        </div>
        {/* Content */}
        <div style={{height: 'fit-content'}} ref={commentRef}>
          <div className='comment-content' 
            style={{
              height: 'fit-content',
              maxHeight: maxCommentHeight.current,
              transition: `max-height 0.1s ${collapsed ? '0s' : '0.15s'}`
            }}
            dangerouslySetInnerHTML={{__html: comment.body_html}}>
          </div>
        </div>
        
        {/* Score, reply button, etc */}
        <div className='comment-actions' style={{marginLeft: '26px'}}>
          {/* Left */}
          <div style={{display: 'flex'}}>
            <Votes score={comment.score} />
          </div>
          {/* Right */}
          <div>
            
          </div>
        </div>
      </div>
      

      {/* Close chain bar */}
      {<div className='comment-chain-close'
          onClick={() => {onToggle(); onToggleComment()}}
          style={{
            height: `calc(100% - ${avatar && avatar.includes('snoovatar') ? '40px' : '35px'})`,
            top: avatar && avatar.includes('snoovatar') ? '40px' : '35px',
            left: `${15 + (comment.depth * 20)}px`,
          }}
        >
          <div></div> {/* inner bar */}
        </div> }

      {/* Replies */}
      {comment.replies && comment.replies.map((comment) => 
        <div key={comment.data.id} style={{overflow: 'hidden', maxHeight: maxHeightRef.current, transition: 'max-height 0.20s'}}>
          {
            (comment.kind === 't1')  
            ? <Comment comment={comment.data as CommentData} postId={postId} sub={sub}/>
            : <More data={comment.data as MoreComments} postId={postId} sub={sub} />
          }
        </div>
      )}
    </div>
  )
}