import { useRef, useState } from 'react';
import { SlideSingle } from '../../../types/postType';
import './Slide.css';

import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai';
import clsx from 'clsx';

interface SlideProps {
  slides: SlideSingle[],
}

export const Slide = ({slides}: SlideProps) => {

  const length = useRef<number>(slides.length);
  
  const [index, setIndex] = useState<number>(0);

  return (
    <div className='slide-wrapper'>
        {slides.map((s, i) => 
          <div key={'inslide ' + s.u} style={{left: `${(i * 100) - (index * 100)}%`}} className='slide-image-wrapper'>
            <img src={s.u} alt='slideshow'></img>  
          </div>
        )}
      <div className='slide-ui'>
        <div className={clsx('slide-move', 'left', {'max': !index})}
          onClick={() => setIndex(p => p - 1)}
        >
          <AiOutlineLeft />
        </div>
        <div className={clsx('slide-move', 'right', {'max': index === length.current - 1})}
          onClick={() => setIndex(p => p + 1)}
        >
          <AiOutlineRight />
        </div>

        <div className='slide-count-wrapper'>
          <div className='slide-count'>
            {slides.map((x, i) => <div onClick={() => setIndex(i)} className={clsx('slide-count-circle', {'active': i === index})}></div>)}
          </div>
        </div>
      </div>
    </div>
  )
}