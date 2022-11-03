import './Sub.css';
import { CiTrash } from 'react-icons/ci';
import { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { removeSubreddit } from '../../features/querySlice';

type dimension = '' | '0';
interface dimensions {
  width: dimension;
  height: dimension;
}

export const Sub = ({sub}: { sub: string}) => {

  const dispatch = useDispatch();
  const [mouseOver, setMouseOver] = useState<boolean>(false);

  const [dimensions, setDimensions] = useState<dimensions>({ width: '', height: ''});

  const subRef = useRef<string>(sub);

  const toggleMouseOver = useCallback(() => {
    setMouseOver((p) => !p);
  }, []);

  const removeSub = useCallback((e:any) => {
    setDimensions({ width: '0', height: '0'});
    setTimeout(() => {
      dispatch(removeSubreddit(subRef.current));
    }, 180);
  }, [dispatch]);

  return (
    <div className={`sub ${sub}`} 
         style={{width: dimensions.width, height: dimensions.height}} 
         onMouseUp={removeSub} 
         onMouseEnter={toggleMouseOver} 
         onMouseOut={toggleMouseOver}>
      <div>
        <p>r/{sub}</p>
      </div>
      <button className="remove-sub">
        <CiTrash className={clsx('trash-icon', {'mouseover': mouseOver})} />
      </button>
    </div>
  )
}