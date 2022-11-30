import './Home.css';

import { Feed } from "./feed/Feed";
import { Navbar } from "./Navbar";
import { useAppSelector } from '../app/hooks/hooks';
import { selectTheme } from '../app/reducers/savedSlice';
import { getRGBA } from '../utility/getRGBA';

export const Home = () => {

  const theme = useAppSelector(selectTheme);
  const color = getRGBA(theme.font_color);
  const background = getRGBA(theme.back);

  return (
    <div id='page' style={{color}}>
      <Navbar />
      <div id='feed-wrapper' style={{background}}>
        <Feed />
      </div>
    </div>
  )
}