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

  const [showReplies, setShowReplies] = useState<boolean>(true);
  const [avatar, setAvatar] = useState<string>();

  useEffect(() => {
    comment.author !== '[deleted]' && fetch(`${base}user/${comment.author}/about.json?raw_json=1`)
      .then(res => res.json())
      .then(data => {
        setAvatar(data.data.snoovatar_img || data.data.icon_img);
      });
  }, [comment.author])

  const onCloseBar = useCallback(() => {
    setShowReplies(p => !p);
  }, []);
  
  return (
    // Tree
    <div className='comment-chain' >

      {/* Comment */}
      <div className={clsx('comment', { 'mod-comment': comment.distinguished === 'moderator'})}
        style={{marginLeft: 8 + (comment.depth * 15)}}  
        ref={commentRef}
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
          </div>
          {/* Right */}
          <div>
          </div>
        </div>
        {/* Content */}
        <div className='comment-content' style={{marginLeft: '14px', display: showReplies ? 'block' : 'none'}}
          dangerouslySetInnerHTML={{__html: comment.body_html}}>
        </div>
        {/* Score, reply button, etc */}
        <div className='comment-actions' style={{marginLeft: '26px'}}>
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
      {<div className='comment-chain-close'
          onClick={onCloseBar}
          style={{
            height: `calc(100% - ${avatar && avatar.includes('snoovatar') ? '40px' : '35px'})`,
            top: avatar && avatar.includes('snoovatar') ? '40px' : '35px',
            left: `${11 + (comment.depth * 15)}px`,
          }}
        >
          <div></div> {/* inner bar */}
        </div> }

      {/* Replies */}
      {comment.replies && comment.replies.map((comment) => 
        <div style={{display: showReplies ? 'block' : 'none'}}>
          {
            (comment.kind === 't1')  
            ? <Comment key={'cmnt' + comment.data.id} comment={comment.data as CommentData} postId={postId} sub={sub}/>
            : <More key={'more' + comment.data.id} data={comment.data as MoreComments} postId={postId} sub={sub} />
          }
        </div>
      )}
    </div>
  )
}