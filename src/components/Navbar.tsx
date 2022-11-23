import './Navbar.css';

import { useRef } from 'react';
import { RiMenu3Line } from 'react-icons/ri';
import { BsChevronDown } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { toggleOpen } from '../app/reducers/subredditsSlice';

import { ReactComponent as RedditDark } from '../images/Reddit_Logotype_OnDark.svg';
import { Settings } from './Settings';


export const Navbar = () => {
  const dispatch = useAppDispatch();

  const navBarRef = useRef<HTMLDivElement>(undefined!);
  const open = useAppSelector(s => s.subreddits.open);

  const rotate = open ? '180deg' : '';

  return (
    <div id='navbar' ref={navBarRef}>
      <div id='navbar-items'>
        {/* Navbar settings menu */}
        <div style={{position: 'relative', maxHeight: '100%', margin: '15px'}}>
          <div className='icon-button' onClick={() => dispatch(toggleOpen())}>
            <RiMenu3Line />
            <div className='drop-down' style={{rotate}}>
              <BsChevronDown />
            </div>
          </div>
          <Settings navBarRef={navBarRef}/>
        </div>

        {/* Reddit logo */}
        <div className='navbar-logo' >
          <RedditDark className='navbar-svg'/>
        </div>
      </div>
    </div>
  )
}