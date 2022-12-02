import './Settings.css';

import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { Sub } from './sub/Sub';
import { Search } from './Search';  
import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { onClearSubreddits, toggleOpen, toggleSrOpen } from '../app/reducers/subredditsSlice';
import { Dropdown } from './ui/Dropdown';
import { Button } from './ui/Button';
import Modal from './ui/Modal';
import { selectTheme, resetSaved, changeTheme, changeBackground, toggleShowNSFW } from '../app/reducers/savedSlice';
import { getRGBA } from '../utility/getRGBA';

import { FaUnsplash } from 'react-icons/fa';
import clsx from 'clsx';


interface SettingsProps {
  navBarRef: MutableRefObject<HTMLDivElement>,
}

export const Settings = ({navBarRef}: SettingsProps) => {
  const dispatch = useAppDispatch();
  
  const open = useAppSelector(s => s.subreddits.open);
  const subs = useAppSelector(s => s.subreddits.in_storage.subs);
  const srOpen = useAppSelector(s => s.subreddits.srOpen);
  const blocked = useAppSelector(s => s.subreddits.in_storage.blocked);
  const showNSFW = useAppSelector(s => s.saved.showNSFW);

  const theme = useAppSelector(selectTheme);
  const defaultBackground = getRGBA(theme.back);
  const bName = useAppSelector(s => s.saved.background);
  const background = getRGBA(theme.front, bName !== 'Default' ? 0.9 : 1);
  const borderColor = getRGBA(theme.border);
  const backgroundAlt = getRGBA(theme.front_alt);


  const themes = useAppSelector(s => s.saved.themes);
  const backgrounds = useAppSelector(s => s.saved.backgrounds);
  
  const themeNames = useMemo<string[]>(() => {
    return Array.from(new Set(themes.map(t => t.theme.split('-')[0])));
  }, [themes]);

  const wrapper = useRef<HTMLDivElement>(undefined!);

  const [confirm, setConfirm] = useState<boolean>(false);

  const onClick = useCallback((e: any) => {
    if (wrapper.current.contains(e.target)
      || (navBarRef.current.contains(e.target) && !e.target.closest('.feed-select'))
      || e.target.classList.contains('open-subreddits')
      || e.target.classList.contains('darkmode')
      || e.target.classList.contains('save-results')) 
    return;

    dispatch(toggleOpen(false));
  }, [dispatch, navBarRef]);

  const onClearLocal = useCallback(() => {
    localStorage.clear();
    dispatch(resetSaved());
    dispatch(onClearSubreddits());
    setConfirm(false);
  }, [dispatch]);

  const onSelectTheme = useCallback((t: string) => {
    dispatch(changeTheme(t));
  }, [dispatch]);

  const current = useAppSelector(s => s.saved.background);
  const currentBackground = useRef<string>(current);
  const onChangeBackground = useCallback((e: any, n: string) => {
    if (n === currentBackground.current
      || e.target.classList.contains('b-card-icon')
    ) return;

    dispatch(changeBackground(n));
    currentBackground.current = n;
  }, [dispatch]);

  useEffect(() => {
    let input:HTMLInputElement | null = document.querySelector('.search'); 
    input && input.focus();
    window.addEventListener('click', onClick);
    return () => { window.removeEventListener('click', onClick) }
  }, [onClick]);

  return (
    <div className="settings hidescrollbar" 
      ref={wrapper} 
      style={{
        overflow: open ? 'auto' : 'hidden', 
        height: open ? '' : '0', 
        background,
        borderColor: open ? borderColor : 'rgba(0,0,0,0)',
        top: open ? '' : 'calc(3.5rem - 11px)'
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
      <Dropdown label='Blocked Communities'>
        <div className='subs-results-container'>
          <div className='selected-subs'>
              {blocked.map((sub) => 
                <Sub sub={sub} key={'blocked-' + sub.name} blocked />
              )}
          </div>
        </div>
      </Dropdown>
      <Dropdown label='Color Theme'>
        <div className='theme-select-wrapper'>
          {themeNames.map(t => (
            <div key={t} 
              className='theme-select noselect'
              style={{borderColor: theme.theme.split('-')[0] === t ? borderColor : ''}}
              onClick={() => onSelectTheme(t)} 
              >
              <input 
                type='radio' id={t} 
                name={t} 
                value={t} 
                onChange={() => {}}
                checked={theme.theme.split('-')[0] === t}/>
              <label htmlFor={t}>{t}</label>
            </div>
            
          ))}
        </div>
      </Dropdown>
      <Dropdown label='Background'>
        <div className='background-select-wrapper'>
          <div className={clsx('b-card', {'active': current === 'Default'})} 
            style={{background: defaultBackground}} 
            onClick={(e) => onChangeBackground(e, 'Default')}
          >
            <div className='b-card-details'>
              Default
            </div>
          </div>
          {backgrounds.map(b => {
          const imgUrl = `${b.url}&w=150&h=150`;
          
          return (
            <div key={b.url} className={clsx('b-card', {'active': current === b.name})} onClick={(e) => onChangeBackground(e, b.name)}>
              <div className='b-card-icon' onClick={() => window.open(b.link, '_blank')!.focus()}>
                <FaUnsplash />
              </div>
              <img src={imgUrl} alt='background preview' />
              <div className='b-card-details'>
                {b.author}
              </div>
            </div>
          )})}
          
        </div>
      </Dropdown>
      <Dropdown label='Other Settings'>
        <div className='other-settings'>
          <Button style={{borderRadius: '20px', margin: '5px 0', backgroundColor: backgroundAlt, padding: '10px', width: '100%'}} onClick={() => setConfirm(true)}>Clear Local Storage</Button>
          <Button style={{borderRadius: '20px', margin: '5px 0', backgroundColor: backgroundAlt, padding: '10px', width: '100%'}} onClick={() => dispatch(toggleShowNSFW())}>{showNSFW ? 'Hide' : 'Show'} NSFW Content</Button>
        </div>
        <Modal open={confirm} onClose={() => setConfirm(false)} fitHeight>
          <Modal.Header>Confirm</Modal.Header>
          <div style={{maxWidth: '400px', display: 'flex', justifyContent: 'center'}}>
            <p style={{fontWeight: 300, width: 'fit-content'}}>This will remove all local data, which includes your saved posts and selected subreddits.</p>
          </div>
          <Modal.Actions>
            <Button style={{borderRadius: '20px', padding: '8px 15px'}} onClick={onClearLocal}>I understand</Button>
            <Button style={{borderRadius: '20px', padding: '8px 15px'}} onClick={() => setConfirm(false)}>Cancel</Button>
          </Modal.Actions>
          
        </Modal>
      </Dropdown>

      
    </div>
  )
}