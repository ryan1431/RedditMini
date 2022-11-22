import './Subreddits.css';

import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { Sub } from './sub/Sub';
import { Search } from './Search';  
import { MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import { toggleOpen } from '../app/reducers/subredditsSlice';
import { Dropdown } from './ui/Dropdown';

interface SubredditsProps {
  navBarRef: MutableRefObject<HTMLDivElement>,
}

export const Subreddits = ({navBarRef}: SubredditsProps) => {
  const open = useAppSelector(s => s.subreddits.open);
  const dispatch = useAppDispatch();
  const subs = useAppSelector((state) => state.subreddits.subs);

  const height = useMemo(() => {
    return open ? '' : '0';
  }, [open]);

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
    <div id="subreddits" ref={wrapper} style={{overflow: open ? 'auto' : 'hidden', height: height, border: open ? '' : 'none'}}>
      <Dropdown label='Subreddits'>
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
