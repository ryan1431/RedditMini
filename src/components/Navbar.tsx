import './Navbar.css';

export const Navbar = () => {
  return (
    <div id='navbar'>
      {/* Navbar hamburger menu */}
      <div id='left'>
        <p>left</p>
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