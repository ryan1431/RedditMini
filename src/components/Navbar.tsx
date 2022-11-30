import './Navbar.css';

import { useCallback, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks/hooks';
import { toggleInSearch, toggleOpen } from '../app/reducers/subredditsSlice';

import { RiMenu3Line } from 'react-icons/ri';
import { HiOutlineCog } from 'react-icons/hi';
import { BsMoonStars, BsMoonStarsFill, BsChevronDown } from 'react-icons/bs'

import { ReactComponent as RedditDark } from '../media/Reddit_Logotype_OnDark.svg';
import { ReactComponent as RedditIcon } from '../media/Reddit_Mark_OnDark.svg';

import { Settings } from './Settings';
import { Search } from './Search';
import { SelectFeed } from './feed/SelectFeed';
import { feedIcons } from '../utility/feedData';
import type { FeedIcons } from '../utility/feedData';
import { selectTheme } from '../app/reducers/savedSlice';
import { getRGBA } from '../utility/getRGBA';

export const Navbar = () => {
  const dispatch = useAppDispatch();

  const navBarRef = useRef<HTMLDivElement>(undefined!);

  const feed = useAppSelector(s => s.query.feed);
  const theme = useAppSelector(selectTheme);
  const background = getRGBA(theme.front);
  const borderBottomColor = getRGBA(theme.border);

  const FeedIcon = feedIcons[feed as keyof FeedIcons];

  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [feedSelectOpen, setFeedSelectOpen] = useState<boolean>(false);

  const onClose = useCallback(() => {
    setFeedSelectOpen(false);
  }, []);

  return (
    <div className='navbar' style={{background, borderBottomColor}} ref={navBarRef}>
      <div id='navbar-items'>
        {/* Navbar settings menu */}
        <div className='navbar-button-wrapper'>
          <div className='icon-button' onClick={() => dispatch(toggleOpen())}>
            <div className='icon-wrapper'>
              <RiMenu3Line className='nav-mobile'/>
              <HiOutlineCog className='nav-desktop' onClick={() => dispatch(toggleInSearch(false))}/>
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
            <div className='icon-button feed-select' onClick={() => setFeedSelectOpen(p => !p)}>
              <div className='icon-wrapper theme'>
                <FeedIcon />
                <p style={{textTransform: 'capitalize'}}>{feed === 'custom' ? 'Following' : feed}</p>
              </div>
              <BsChevronDown className='icon-arrow'/>
            </div>
            <SelectFeed open={feedSelectOpen} onClose={onClose}/>
          </div>
          <div className='nav-desktop nav-search' onClick={() => dispatch(toggleOpen(false))}>
            <div className='search-bar'  >
              <Search />
            </div>
          </div>
        </div>

        {/* Reddit logo */}
        <div className='navbar-logo' >
          <RedditIcon className='navbar-svg icon'/>
          <RedditDark className='navbar-svg text'/>
          <h2 className='navbar-logo-ext noselect'>mini</h2>
        </div>
      </div>
    </div>
  )
}