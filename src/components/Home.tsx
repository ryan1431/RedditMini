import './Home.css';

import { Feed } from "./feed/Feed";
import { Navbar } from "./Navbar";
import { useAppSelector } from '../app/hooks/hooks';
import { currentThemeInfo } from '../app/reducers/savedSlice';

export const Home = () => {

  const theme = useAppSelector(currentThemeInfo);
  const {r, g, b} = theme.font_color;

  return (
    <div id='page' style={{color: `rgb(${r}, ${g}, ${b})`}}>
      <Navbar />
      <div id='feed-wrapper'>
        <Feed />
      </div>
    </div>
  )
}