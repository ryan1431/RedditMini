import './Navbar.css';

import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { toggleOpen } from '../app/reducers/subredditsSlice';

import { RiMenu3Line } from 'react-icons/ri';
import { HiOutlineCog, HiOutlineHome } from 'react-icons/hi';
import { BsMoonStars, BsMoonStarsFill, BsChevronDown } from 'react-icons/bs'

import { ReactComponent as RedditDark } from '../media/Reddit_Logotype_OnDark.svg';
import { ReactComponent as RedditIcon } from '../media/Reddit_Mark_OnDark.svg';

import { Settings } from './Settings';
import { Search } from './Search';



export const Navbar = () => {
  const dispatch = useAppDispatch();

  const navBarRef = useRef<HTMLDivElement>(undefined!);

  const feed = useAppSelector(s => s.query.feed);

  const [darkMode, setDarkMode] = useState<boolean>(true);

  return (
    <div id='navbar' ref={navBarRef}>
      <div id='navbar-items'>
        {/* Navbar settings menu */}
        <div className='navbar-button-wrapper'>
          <div className='icon-button' onClick={() => dispatch(toggleOpen())}>
            <div className='icon-wrapper'>
              <RiMenu3Line className='nav-mobile'/>
              <HiOutlineCog className='nav-desktop'/>
            </div>
          </div>
          <div className='icon-button' onClick={() => setDarkMode(p => !p)}>
            <div className='icon-wrapper theme'>
              {darkMode ? <BsMoonStarsFill /> : <BsMoonStars />}
            </div>
          </div>
          <Settings navBarRef={navBarRef}/>
        </div>

        {/* Feed Select & Search Bar */}
        <div className='navbar-feed-search'>
          <div className='navbar-button-wrapper'>
            <div className='icon-button feed-select'>
              <div className='icon-wrapper theme'>
                {feed === 'home'
                  ? <HiOutlineHome />
                  : feed === 'custom'
                    ? <HiOutlineHome />
                  : feed === 'saved'
                    ? <HiOutlineHome />
                  : feed === 'news' 
                    ? <HiOutlineHome />
                  : <HiOutlineHome />}
                  <p>Home</p>
              </div>
              <BsChevronDown className='icon-arrow'/>
            </div>
          </div>
          <div className='nav-desktop nav-search'>
            <div id='search-bar'  >
              <Search />
            </div>
          </div>
        </div>
        

        {/* Reddit logo */}
        <div className='navbar-logo' >
          <RedditIcon className='navbar-svg icon'/>
          <RedditDark className='navbar-svg text'/>
          <h2 className='navbar-logo-ext'>mini</h2>
        </div>
      </div>
    </div>
  )
}