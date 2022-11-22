import React from 'react';
import './Navbar.css';
import { FiSettings } from 'react-icons/fi';
import { BsChevronDown } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { toggleOpen } from '../app/reducers/subredditsSlice';

import { ReactComponent as RedditDark } from '../images/Reddit_Logotype_OnDark.svg';


export const Navbar = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(s => s.subreddits.open);

  const rotate = open ? '180deg' : '';

  return (
    <div id='navbar'>
      <div id='navbar-items'>
        {/* Navbar settings menu */}
        <div className='icon-button' onClick={() => dispatch(toggleOpen())}>
          <FiSettings />
          <div className='drop-down' style={{rotate}}>
            <BsChevronDown />
          </div>
        </div>

        {/* Reddit logo */}
        <div className='navbar-logo' >
          <RedditDark className='navbar-svg'/>
        </div>
      </div>
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