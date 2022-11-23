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
      || (navBarRef.current.contains(e.target) && !e.target.closest('.feed-select'))
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
    <div className="settings hidescrollbar" 
      ref={wrapper} 
      style={{
        overflow: open ? 'auto' : 'hidden', 
        height: open ? '' : '0', 
        // border: open ? '' : 'none'
      }}
    >
      <Dropdown label='Followed Subreddits' 
        open={srOpen} 
        onToggle={() => dispatch(toggleSrOpen())}
      >
        <div className='subs-results-container'> 
          <div className='search-bar nav-mobile'>
            <Search />
          </div>

          <div className="selected-subs">
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
        <div className='other-settings'>
          <Button style={{padding: '10px'}} onClick={() => setConfirm(true)}>Clear Local Storage</Button>
        </div>
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