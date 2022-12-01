import './Home.css';

import { Feed } from "./feed/Feed";
import { Navbar } from "./Navbar";
import { useAppSelector } from '../app/hooks/hooks';
import { selectBackground, selectTheme } from '../app/reducers/savedSlice';
import { getRGBA } from '../utility/getRGBA';

export const Home = () => {

  const theme = useAppSelector(selectTheme);
  const color = getRGBA(theme.text);
  let backgroundImage = useAppSelector(selectBackground);
  const background = backgroundImage || getRGBA(theme.back);

  return (
    <div id='page' style={{color, background}}>
      <Navbar />
      <div id='feed-wrapper'>
        <Feed />
      </div>
    </div>
  )
}