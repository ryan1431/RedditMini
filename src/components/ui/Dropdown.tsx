import { useCallback, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import './Dropdown.css';

interface DropdownProps {
  label: string,
  initiallyOpen?: boolean,
  open?: boolean,
  onToggle?: (...args: any) => any,
  children?: React.ReactNode,
}

export const Dropdown = ({label, open, onToggle, initiallyOpen = false, children}:DropdownProps) => {

  const [openLocal, setOpenLocal] = useState<boolean>(initiallyOpen);

  const openStyle = {
    rotate: '180deg',
    maxHeight: 'fit-content',
    display: 'block',
  }
  const closedStyle = {
    rotate: '0deg',
    maxHeight: '0',
    display: 'none',
  }
  const style = (open === undefined)
    ? openLocal ? openStyle : closedStyle
    : open ? openStyle : closedStyle;
  
  const onClick = useCallback(() => {
    if (open !== undefined) {
      if (onToggle) onToggle();
      return;
    }
    setOpenLocal(p => !p);
  }, [onToggle, open]);
  
  return (
    <div className='ui-dropdown'>
      <div className='ui-dropdown-toggle' onClick={onClick}>
        <p>{label}</p>
        <BsChevronDown className='ui-dropdown-arrow' style={{rotate: style.rotate}}/>
        <hr></hr> 
      </div>

      {/* Container Content */}
      <div className='ui-dropdown-content' 
        style={{
          maxHeight: style.maxHeight,
          display: style.display,
        }}
      >
        {children}
      </div>  
    </div>
  );
}