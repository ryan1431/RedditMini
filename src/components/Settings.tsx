import './Settings.css';

import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { Sub } from './sub/Sub';
import { Search } from './Search';  
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { onClearSubreddits, toggleOpen, toggleSrOpen } from '../app/reducers/subredditsSlice';
import { Dropdown } from './ui/Dropdown';
import { Button } from './ui/Button';
import Modal from './ui/Modal';
import { onClearSaved } from '../app/reducers/savedSlice';

interface SettingsProps {
  navBarRef: MutableRefObject<HTMLDivElement>,
}

export const Settings = ({navBarRef}: SettingsProps) => {
  const dispatch = useAppDispatch();
  
  const open = useAppSelector(s => s.subreddits.open);
  const subs = useAppSelector(s => s.subreddits.subs);
  const srOpen = useAppSelector(s => s.subreddits.srOpen);

  const wrapper = useRef<HTMLDivElement>(undefined!);

  const [confirm, setConfirm] = useState<boolean>(false);

  const onClick = useCallback((e: any) => {
    if (wrapper.current.contains(e.target)
      || navBarRef.current.contains(e.target)
      || e.target.classList.contains('open-subreddits')
      || e.target.classList.contains('save-results')) 
    return;

    dispatch(toggleOpen(false));
  }, [dispatch, navBarRef]);

  const onClearLocal = useCallback(() => {
    localStorage.clear();
    dispatch(onClearSaved());
    dispatch(onClearSubreddits());
    setConfirm(false);
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('click', onClick);
    return () => { window.removeEventListener('click', onClick) }
  }, [onClick]);

  return (
    <div id="settings" 
      ref={wrapper} 
      style={{
        overflow: open ? 'auto' : 'hidden', 
        height: open ? '' : '0', 
        border: open ? '' : 'none'
      }}
    >
      <Dropdown label='Followed Subreddits' 
        open={srOpen} 
        onToggle={() => dispatch(toggleSrOpen())}
      >
        <div className='subs-results-container'> 
          <div id='search-bar' className='nav-mobile'>
            <Search />
          </div>

          <div id="selected-subs">
            {subs.map((sub) =>
              <Sub sub={sub} key={'selected-' + sub.name}/>
            )}
          </div>
        </div>
      </Dropdown>
      <Dropdown label='Blocked Subreddits'>
      </Dropdown>
      <Dropdown label='Blocked Users'>
      </Dropdown>
      <Dropdown label='Other Settings'>
        <Button onClick={() => setConfirm(true)}>Clear Local Storage</Button>
        <Modal open={confirm} onClose={() => setConfirm(false)} fitHeight>
          <Modal.Header>Confirm</Modal.Header>
          <div style={{maxWidth: '400px', display: 'flex', justifyContent: 'center'}}>
            <p style={{fontWeight: 300, width: 'fit-content'}}>This will remove all local data, which includes your saved posts and selected subreddits.</p>
          </div>
          <Modal.Actions>
            <Button onClick={onClearLocal}>I understand</Button>
            <Button onClick={() => setConfirm(false)}>Cancel</Button>
          </Modal.Actions>
          
        </Modal>
      </Dropdown>

      
    </div>
  )
}


/*
<div> 
{process.env.NODE_ENV === 'development' && <button onClick={() => localStorage.clear()}>clearlocal</button>}
{process.env.NODE_ENV === 'development' && <button onClick={() => {
  const kb = (new Blob(Object.values(localStorage)).size / 1000).toFixed(2);
  console.log('%cLocal Storage: %c' + kb + 'kb (%c' + (Number(kb) / 5000).toFixed(3) + '%)', 'color: ghostwhite', 'color: yellow', 'color: orange');
}}>local size</button>}
<button>darkmode</button>
</div>

*/