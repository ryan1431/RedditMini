import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { IconType } from 'react-icons/lib';

import './Menu.css';

interface MenuProps {
  open: boolean,
  className?: string,
  icon?: IconType
  onIconClick?: (...args: any) => any,
  openRight?: boolean,
  children?: React.ReactNode
}

export const Menu = ({open, className = '', icon, onIconClick, openRight = false, children}: MenuProps) => {
  const MenuIcon = icon || BiDotsHorizontalRounded;
  
  return (
    <div className={`ui-menu ${className}`} style={{position: 'relative'}}>
      <div className='ui-menu-trigger' onClick={onIconClick}>
        <MenuIcon />
      </div>
      {open && <div className='ui-menu-dropdown' 
          style={openRight ? {left: 0} : {right: 0}}
        >
          {children}
        </div>}
    </div>
     
  )
}