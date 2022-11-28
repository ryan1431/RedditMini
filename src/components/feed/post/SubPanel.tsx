import { SubMeta } from '../../../types';
import './SubPanel.css';
import defaultIcon from '../../../media/srdefault.jpeg';
import { getScore } from '../../../utility/getScore';
import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks/hooks';
import { toggleSubreddit } from '../../../app/reducers/subredditsSlice';

interface SubPanelProps {
  open: boolean,
  data: SubMeta | undefined,
  name: string,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export const SubPanel = ({open, data, name, setOpen}: SubPanelProps) => {
  const dispatch = useAppDispatch();
  
  const imageSrc = data?.banner_img || data?.header_img || '';

  const followed = useAppSelector(s => s.subreddits.in_storage.subs).some((s) => s.name === name);
  
  const onToggleFollow = useCallback(() => {
    const sub = {
      name,
      icon_url: data!.community_icon,
      is_valid: true,
    }

    dispatch(toggleSubreddit(sub))
  }, [data, dispatch, name]);
  
  return data ? (
    <div className='sub-details-panel' style={{display: open ? '' : 'none'}}>
      {imageSrc && <div className='sub-details-banner'>
        <img src={imageSrc} alt="subreddit banner"></img>
      </div> }
      <div className='sub-details-sub'>
        <img className='post-sub-img' src={data.community_icon || data.icon_img || defaultIcon} alt='subreddit icon'></img>
        <h3><span className='name-prefix'>r/</span>{name}</h3>
      </div>
      <div className='sub-activity'>
        <p>{getScore(data.subscribers)} members</p>
        <p>{getScore(data.active_user_count)} online</p>
      </div>
      <hr></hr>
      <p className='sub-desc'>{data.public_description}</p>
      <div className='sub-details-actions'>
        <div className='sub-details-button' onClick={onToggleFollow}><p>{followed ? 'Unfollow' : 'Follow'}</p></div>
        <div className='sub-details-button' onClick={() => setOpen(false)}><p>Block Community</p></div>
      </div>
    </div>
  ) : <></>
}