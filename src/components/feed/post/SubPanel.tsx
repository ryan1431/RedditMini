/* eslint-disable jsx-a11y/alt-text */
import { SubMeta } from '../../../types';
import './SubPanel.css';
import defaultIcon from '../../../media/srdefault.jpeg';
import { getScore } from '../../../utility/getScore';


interface SubPanelProps {
  open: boolean,
  data: SubMeta | undefined,
  name: string,
}

export const SubPanel = ({open, data, name}: SubPanelProps) => {
  const imageSrc = data?.banner_img || data?.header_img || '';

  return data ? (
    <div className='sub-details-panel' style={{opacity: open ? 1 : 0}}>
      {imageSrc && <div className='sub-details-banner'>
        <img src={imageSrc}></img>
      </div> }
      <div className='sub-details-sub'>
        <img className='post-sub-img' src={data.community_icon || data.icon_img || defaultIcon} alt='subreddit icon'></img>
        <h3><span className='name-prefix'>r/</span>{name}</h3>
      </div>
      <p>{getScore(data.active_user_count)} active users</p>
      <p>{data.public_description}</p>
      
    </div>
  ) : <></>
}