import { IconType } from 'react-icons';
import { HiOutlineHome, HiOutlineSparkles } from 'react-icons/hi';
import { RiRedditFill } from 'react-icons/ri';
import { BsBookmark } from 'react-icons/bs';
import { BiRocket, BiBarChartAlt2 } from 'react-icons/bi';
import { AiOutlineFire, AiOutlineRise } from 'react-icons/ai';

export interface FeedIcons {
  home: IconType,
  custom: IconType,
  saved: IconType,
}

export const feedIcons: FeedIcons = {
  home: HiOutlineHome,
  custom: RiRedditFill,
  saved: BsBookmark,
}

export interface SortIcons {
  best: IconType,
  hot: IconType,
  new: IconType,
  top: IconType,
  rising: IconType,
}

export const sortIcons: SortIcons = {
  best: BiRocket,
  hot: AiOutlineFire,
  new: HiOutlineSparkles,
  top: BiBarChartAlt2,
  rising: AiOutlineRise,
}

export const feedOptions: (keyof FeedIcons)[] = ['home', 'custom', 'saved'];