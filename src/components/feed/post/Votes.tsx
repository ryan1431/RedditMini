import { getScore } from '../../../utility/getScore';
import { BiUpvote, BiDownvote } from 'react-icons/bi';

import './Votes.css';
import { useCallback, useRef, useState } from 'react';
import { useAppSelector } from '../../../app/hooks/hooks';
import { selectTheme } from '../../../app/reducers/savedSlice';
import { getRGBA } from '../../../utility/getRGBA';

interface VotesProps {
  score: number,
}

export const Votes = ({score}: VotesProps) => {
  const formatted = getScore(score);
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const pRef = useRef<HTMLParagraphElement>(undefined!);

  const theme = useAppSelector(selectTheme);
  const borderColor = getRGBA(theme.border);
  
  const onClick = useCallback((e?: any) => {
    if (pRef.current.contains(e.target)) return;
    setMouseOver(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setMouseOver(false);
  }, []);


  return (
    <div className='votes' onClick={onClick} onMouseLeave={onMouseLeave}> 
      <BiUpvote className='votes-arrow' />
      <p ref={pRef} className='votes-count' onMouseOver={onMouseLeave}>{formatted}</p>
      <BiDownvote className='votes-arrow'/>
      <div className='votes-novote' style={{
        width: mouseOver ? '15rem' : '',
        opacity: mouseOver ? '1' : '',
        borderColor,
      }}><p>Voting is currently not available</p></div>
    </div>
  );
}