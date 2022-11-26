import './Post.css';

import { PostType } from '../../../utility';
import { Video } from '.././post/Video';
import { TextBody } from '.././post/TextBody';
import { ImageBody } from '.././post/ImageBody';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { save, unsave } from '../../../app/reducers/savedSlice';
import { useAppSelector } from '../../../app/hooks/hooks';
import { getRelativeTime } from '../../../utility/getRelativeTime';
import { Votes } from './Votes';
import { Menu } from '../../ui/Menu';

import { BiHide } from 'react-icons/bi';
import { AiOutlineLink } from 'react-icons/ai';
import { TfiComment } from 'react-icons/tfi';
import { base } from '../../../utility/data';
import { SubMeta } from '../../../types';

interface PostProps { 
  post: PostType,
  open?: boolean,
  clicked?: boolean,
  setOpenPost?: React.Dispatch<React.SetStateAction<PostType | null>>,
  onHide?: (...args: any) => any,
  subHash: Map<string, SubMeta>,
}

export const Post = ({post, clicked, setOpenPost, open = false, onHide, subHash}: PostProps) => {
  const dispatch = useDispatch();

  const savedPosts = useAppSelector(s => s.saved.savedPosts);
  const hidden = !!useAppSelector(s => s.saved.hidden).find(p => p === post.name);

  const saved = savedPosts.some(p => p.link === post.link);

  const [ subData, setSubData ] = useState<SubMeta>();
  
  const onSave = useCallback(() => {
    if (saved) {
      dispatch(unsave(post));
    } else {
      dispatch(save(post));
    }
  }, [dispatch, post, saved]);

  useEffect(() => {
    if (clicked && setOpenPost) {
      setOpenPost(post);
    }
  }, [clicked, post, setOpenPost]);

  useEffect(() => {
    let active = true;
    if (subData) return;
    
    const existing = subHash.get(post.subreddit_id);
    if (existing) {
      setSubData(existing);
      return;
    }

    fetch(`${base}r/${post.subreddit}/about/.json?raw_json=1`)
      .then(res => res.json())
      .then(data => ({
          active_user_count: data.data.active_user_count,
          banner_background_color: data.data.banner_background_color,
          banner_img: data.data.banner_img,
          community_icon: data.data.community_icon,
          header_img: data.data.header_img,
          icon_img: data.data.icon_img,
          id: data.data.id,
          public_description: data.data.public_description,
          public_description_html: data.data.public_description_html,
          display_name: data.data.display_name,
          name: data.data.name,
        }))
      .then((subMeta: SubMeta) => {
        if (active) {
          // dispatch(addSubMeta(subMeta));
          setSubData(subMeta);
          console.log(subMeta);
        }
      })

      return () => {
        active = false;
      }

  }, [dispatch, post.subreddit, post.subreddit_id, subData]);

  return (
    <>
      {post && !hidden && (
      <article className={`post ${post.link}`}>
        {/* Subreddit & Poster Info */}
        <address className='details-wrapper'>
          <div className='details-left'>
            {!open && <p><a className='sub-link' href={`https://www.reddit.com/${post.subreddit_name_prefixed}`} rel='noreferrer' target={'_blank'}>r/{post.subreddit}</a></p>}
            <p className='post-details author'>
              {!open && <span>• </span>}
              <span className='name-prefix'>u/</span>{post.author}
            </p>
            <p className='post-details'>{getRelativeTime(post.created_utc * 1000)}</p>
          </div>
          <Menu className='details-menu'>
            <div className='menu-items-wrapper'>
              <div className='menu-item hide-post' onClick={() => onHide && onHide(post.name)}>
                <p>Hide Post</p>
                <BiHide />
              </div>
              <div className='menu-item' onClick={() => window.open(post.link, '_blank')?.focus()}>
                <p>Open in Reddit</p>
                <AiOutlineLink />
              </div>
            </div>
          </Menu>
        </address>

        {/* Title */}
        <header className='post-title'>
          <h2>{post.title}</h2>
        </header>
        {/* Body */}
        <main className={`post-body ${post.type}`}>
          {
            post.type === 'video' ? <Video url={post.content_url}/>
            : post.type === 'image' ? <ImageBody url={post.content_url}/>
            : <TextBody selftext={post.selftext} selftext_html={post.selftext_html} />
          }
        </main>
        
        {/* Info / Actions */}
        <footer className='info'>
          <div className='info-details'>
            <Votes score={post.score} />
            <div className='info-details-comments'>
              <TfiComment size={14}/>
              <p>{post.num_comments}</p>
            </div>
          </div>
          <button className='info-save' onClick={onSave}>{saved ? 'Unsave' : 'Save'}</button>
        </footer>
      </article>
      )}

    </> )
}