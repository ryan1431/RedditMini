import './Subreddits.css';

import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { Sub } from './sub/Sub';
import { Search } from './Search';  
import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { toggleOpen, toggleSrOpen } from '../app/reducers/subredditsSlice';
import { Dropdown } from './ui/Dropdown';

interface SubredditsProps {
  navBarRef: MutableRefObject<HTMLDivElement>,
}

export const Subreddits = ({navBarRef}: SubredditsProps) => {
  const dispatch = useAppDispatch();
  
  const open = useAppSelector(s => s.subreddits.open);
  const subs = useAppSelector(s => s.subreddits.subs);
  const srOpen = useAppSelector(s => s.subreddits.srOpen);

  const wrapper = useRef<HTMLDivElement>(undefined!);

  const onClick = useCallback((e: any) => {
    if (wrapper.current.contains(e.target)
      || navBarRef.current.contains(e.target)
      || e.target.classList.contains('open-subreddits')
      || e.target.classList.contains('save-results')) 
    return;

    dispatch(toggleOpen(false));
  }, [dispatch, navBarRef]);

  useEffect(() => {
    window.addEventListener('click', onClick);
    return () => { window.removeEventListener('click', onClick) }
  }, [onClick]);

  return (
    <div id="subreddits" 
      ref={wrapper} 
      style={{
        overflow: open ? 'auto' : 'hidden', 
        height: open ? '' : '0', 
        border: open ? '' : 'none'
      }}
    >
      <Dropdown label='Subreddits' 
        open={srOpen} 
        onToggle={() => dispatch(toggleSrOpen())}
      >
        <div className='subs-results-container'> 
          <div id='search-bar'  >
            <Search />
          </div>

          <div id="selected-subs">
            {subs.map((sub) =>
              <Sub sub={sub} key={'selected-' + sub.name}/>
            )}
          </div>
        </div>
      </Dropdown>
      <Dropdown label='Other Menu'>
        
      </Dropdown>
      
    </div>
  )
}
