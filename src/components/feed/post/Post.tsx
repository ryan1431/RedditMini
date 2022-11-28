import './Post.css';

import { PostType } from '../../../utility';
import { Video } from '.././post/Video';
import { TextBody } from '.././post/TextBody';
import { ImageBody } from '.././post/ImageBody';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { save, unsave } from '../../../app/reducers/savedSlice';
import { useAppSelector } from '../../../app/hooks/hooks';
import { getRelativeTime } from '../../../utility/getRelativeTime';
import { Votes } from './Votes';
import { Menu } from '../../ui/Menu';

import { BiHide } from 'react-icons/bi';
import { AiOutlineLink } from 'react-icons/ai';
import { TfiComment } from 'react-icons/tfi';
import { MdIosShare } from 'react-icons/md';

import { base } from '../../../utility/data';
import { SubMeta } from '../../../types';
import { SelectedPostData } from '../Feed';
import LRU from '../../../utility/LRU';

import defaultIcon from '../../../media/srdefault.jpeg';
import { SubPanel } from './SubPanel';

interface PostProps { 
  post: PostType,
  open?: boolean,
  clicked?: boolean,
  setSelectedPostData?: React.Dispatch<React.SetStateAction<SelectedPostData | null>>,
  onHide?: (...args: any) => any,
  onCopyLink?: (...args: any) => any,
  SubDataLRU: LRU<string, SubMeta>,
}

export const Post = ({post, clicked, setSelectedPostData, open = false, onHide, onCopyLink, SubDataLRU}: PostProps) => {
  const dispatch = useDispatch();

  const savedPosts = useAppSelector(s => s.saved.savedPosts);
  const hidden = !!useAppSelector(s => s.saved.hidden).find(p => p === post.name);

  const saved = savedPosts.some(p => p.link === post.link);

  const [subData, setSubData] = useState<SubMeta>();
  const [showSubData, setShowSubData] = useState<boolean>(false);

  const onSave = useCallback(() => {
    if (saved) {
      dispatch(unsave(post));
    } else {
      dispatch(save(post));
    }
  }, [dispatch, post, saved]);

  const timeoutRef = useRef<NodeJS.Timeout>();

  const onHoverSub = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowSubData(true);
    }, 600);
  }, []);
  const onMouseOut = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setShowSubData(false);
  }, []);

  useEffect(() => {
    if (clicked && setSelectedPostData) {
      setSelectedPostData({post, subMeta: subData});
    }
  }, [clicked, post, setSelectedPostData, subData]);

  useEffect(() => {
    let active = true;
    if (subData) return;
    
    const existing = SubDataLRU.get(post.subreddit_id);
    if (existing) {
      setSubData(existing);
      return;
    }

    fetch(`${base}r/${post.subreddit}/about/.json?raw_json=1`)
      .then(res => res.json())
      .then(json => ({
          active_user_count: json.data.active_user_count,
          banner_background_color: json.data.banner_background_color,
          banner_img: json.data.banner_img,
          community_icon: json.data.community_icon,
          header_img: json.data.header_img,
          icon_img: json.data.icon_img,
          id: json.data.id,
          public_description: json.data.public_description,
          public_description_html: json.data.public_description_html,
          display_name: json.data.display_name,
          name: json.data.name,
          subscribers: json.data.subscribers,
        }))
      .then((subMeta: SubMeta) => {
        if (active) {
          SubDataLRU.set(subMeta.name, subMeta);
          setSubData(subMeta);
        }
      })

      return () => {
        active = false;
      }

  }, [SubDataLRU, dispatch, post.subreddit, post.subreddit_id, subData]);

  return (
    <>
      {post && !hidden && (
      <article className={`post ${post.link}`}>
        {/* Subreddit & Poster Info */}
        <address className='details-wrapper'>
          <div className='details-left'>
            <div className='post-sub-details' onMouseEnter={onHoverSub} onMouseLeave={onMouseOut}>
              {subData && <img className='post-sub-img' src={subData.community_icon || subData.icon_img || defaultIcon} alt='subreddit icon'></img>}
              {!open && <p className='sub-name'>r/{post.subreddit}</p>}
              <SubPanel open={showSubData} data={subData} name={post.subreddit} setOpen={setShowSubData}/>
            </div>
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
              <div className='menu-item' onClick={() => onCopyLink && onCopyLink(post.link)}>
                <p>Copy Link</p>
                <MdIosShare />
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