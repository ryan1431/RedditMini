import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { IconType } from 'react-icons/lib';
import { useAppSelector } from '../../app/hooks/hooks';
import { selectTheme } from '../../app/reducers/savedSlice';
import { getRGBA } from '../../utility/getRGBA';

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

  const theme = useAppSelector(selectTheme);
  const borderColor = getRGBA(theme.border);
  const background = getRGBA(theme.front)
  
  return (
    <div className={`ui-menu ${className}`} style={{position: 'relative'}}>
      <div className='ui-menu-trigger' onClick={onIconClick}>
        <MenuIcon />
      </div>
      {open && <div className='ui-menu-dropdown' 
          style={
            openRight ? {left: 0, borderColor, background} : {right: 0, borderColor, background} 
          }
        >
          {children}
        </div>}
    </div>
     
  )
}