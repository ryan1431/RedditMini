import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDynamicTransition } from '../../app/hooks/useDynamicTransition';
import { CommentData, MoreComments } from '../../types/commentType';
import { base } from '../../utility/data';
import { getRelativeTime } from '../../utility/getRelativeTime';
import './Comment.css';
import { More } from './More';
import { Votes } from './post/Votes';
import { TfiComment } from 'react-icons/tfi';

import defaultAvatar from '../../media/avatar_default.png';
import { useAppSelector } from '../../app/hooks/hooks';
import { currentThemeInfo } from '../../app/reducers/savedSlice';

interface CommentProps {
  comment: CommentData,
  postId: string,
  sub: string,
  resizeDep: any,
}

export const Comment = ({comment, postId, sub, resizeDep}: CommentProps) => {
  const wrapperRef = useRef<HTMLDivElement>(undefined!);
  const commentRef = useRef<HTMLDivElement>(undefined!);

  const avatarRef = useRef<HTMLImageElement>(undefined!);

  const [avatar, setAvatar] = useState<string>();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const theme = useAppSelector(currentThemeInfo);
  const { r, g, b } = theme.font_color;
  
  const { onToggle, maxHeightRef, display } = useDynamicTransition(wrapperRef, 250, resizeDep);
  const { onToggle: onToggleComment, maxHeightRef: maxCommentHeight, showReplies} = useDynamicTransition(commentRef, 250, resizeDep);
  
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
        setAvatar(data.data.snoovatar_img || data.data.icon_img || defaultAvatar);
      });
  }, [comment.author])

  const useDefaultAvatar = useCallback(() => {
    setAvatar('___');
    if (avatarRef.current.src !== defaultAvatar) {
      avatarRef.current.src = defaultAvatar;
    }
  }, []);
  
  return (
    // Tree
    <div className='comment-chain' ref={wrapperRef}>

      {/* Comment */}
      <div className={clsx('comment', { 'mod-comment': comment.distinguished === 'moderator'})}
        style={{marginLeft: 8 + (comment.depth * 20)}}  
      >
        {/* Top Bar (username, posted time) */}
        <div className={clsx('comment-bar', {'op': comment.is_submitter})}>
          {/* Left */}
          <div>
            {avatar && 
              <img src={avatar} 
                ref={avatarRef} 
                onError={useDefaultAvatar}  
                alt='user-avatar' 
                className={
                  clsx(
                    'user-avatar', 
                    {
                      'snoovatar': avatar.includes('snoovatar')
                    },
                  )}
                ></img>}
            <p>
              <span className='name-prefix'>u/</span>
              <span className='comment-author'>{comment.author}</span>
              {comment.distinguished === 'moderator' && <span className='spec moderator'>MOD</span>}
              {comment.is_submitter && <span className='spec op'>OP</span>}
            </p>
            <p className='comment-details'>{getRelativeTime(comment.created_utc * 1000)}</p>

          </div>
          {/* Right */}
          <div>
          </div>
        </div>
        {/* Content */}
        <div style={{
            height: 'fit-content',
            display: display ? 'block' : 'none',
          }} 
          ref={commentRef}>
          <div className='comment-content' 
            style={{
              height: 'fit-content',
              maxHeight: maxCommentHeight.current,
              transition: `max-height 0.1s ${collapsed ? '0s' : '0.15s'}`,
            }}
            dangerouslySetInnerHTML={{__html: comment.body_html}}>
          </div>
        </div>
        
        {/* Score, reply button, etc */}
        <div className='comment-actions' style={{marginLeft: '26px', color: `rgba(${r}, ${g}, ${b}, 0.7)`}}>
          {/* Left */}
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Votes score={comment.distinguished === 'moderator' ? 0 : comment.score} />
            <TfiComment className='icon' onClick={() => {onToggle(); onToggleComment()}} />
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
        <div key={comment.data.id} 
          style={{
            overflow: 'hidden', 
            maxHeight: maxHeightRef.current, 
            transition: 'max-height 0.20s',
            display: display ? 'block': 'none',
          }}>
          {
            (comment.kind === 't1')  
            ? <Comment comment={comment.data as CommentData} postId={postId} sub={sub} resizeDep={resizeDep}/>
            : <More data={comment.data as MoreComments} postId={postId} sub={sub} />
          }
        </div>
      )}
    </div>
  )
}