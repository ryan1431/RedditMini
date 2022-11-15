import React from 'react';
import './Navbar.css';

interface NavbarProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export const Navbar = ({setOpen}: NavbarProps) => {

  return (
    <div id='navbar'>
      {/* Navbar hamburger menu */}
      <div id='left'>
        <input type="button" value='Custom Feed' onClick={() => setOpen((p) => !p)}/>
      </div>

      {/* Reddit logo */}
      <div>
        <p>Reddit mini (logo)</p>
      </div>

      {/* Light / Dark mode button */}
      <div> 
        {process.env.NODE_ENV === 'development' && <input type='button' value='clearlocal' onClick={() => localStorage.clear()}></input>}
        {process.env.NODE_ENV === 'development' && <input type='button' value='local size' onClick={() => {
          const kb = (new Blob(Object.values(localStorage)).size / 1000).toFixed(2);
          console.log('%cLocal Storage: %c' + kb + 'kb (%c' + (Number(kb) / 5000).toFixed(3) + '%)', 'color: ghostwhite', 'color: yellow', 'color: orange');
        }}></input>}
        <input type="button" value='darkmode'></input>
      </div>
    </div>
  )
}