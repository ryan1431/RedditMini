import './Navbar.css';

import type { CSS } from './Home';

interface NavbarProps {
  css: CSS,
  setCss: React.Dispatch<React.SetStateAction<CSS>>,
  width: number,
}

export const Navbar = (props: NavbarProps) => {

  const { css, setCss, width } = props;

  const toggleLeftPane = () => {
    setCss(
      css.border === 'none' 
        ? {
          basis: width < 700 
            ? '99vw' 
            : '310px',
          border: '2px solid red',
        } : {
          basis: '0px',
          border: 'none',
        }
    );
  }

  return (
    <div id='navbar'>
      {/* Navbar hamburger menu */}
      <div id='left'>
        <input type="button" value='left pane' onClick={toggleLeftPane}/>
      </div>

      {/* Reddit logo */}
      <div>
        <p>Reddit mini (logo)</p>
      </div>

      {/* Light / Dark mode button */}
      <div> 
        <p>Light</p>
        <input type="button"></input>
        <p>Dark</p>
      </div>
    </div>
  )
}