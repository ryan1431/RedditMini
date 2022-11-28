import './Slide.css';

interface SlideProps {
  slides: string[],
}

export const Slide = ({slides}: SlideProps) => {



  return (
    <div className='slide-wrapper'>
      <img src={slides[0]} alt='reddit-slideshow' />
    </div>
  )
}