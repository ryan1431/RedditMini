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
        <div className='slider' style={{left: `-${index}00%`}}>
          {slides.map((s) => 
            s ? <div key={'inslide ' + s.u} className='slide-image-wrapper'>
              <img src={s.u} alt='slideshow'></img>  
            </div> : <></>
          )}
        </div>

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
            {slides.map((x, i) => 
              <div key={`slide-circles-${slides[0].u}-${i}`} className='slide-circle-area' onClick={() => setIndex(i)} >
                <div className={clsx('slide-count-circle', {'active': i === index})}></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}