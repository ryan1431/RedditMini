import { IconType } from 'react-icons';
import { HiOutlineHome } from 'react-icons/hi';
import { RiRedditFill } from 'react-icons/ri';
import { BsBookmark } from 'react-icons/bs';

export interface FeedIcons {
  home: IconType,
  custom: IconType,
  saved: IconType,
}

export const feedIcons = {
  home: HiOutlineHome,
  custom: RiRedditFill,
  saved: BsBookmark,
}

export const feedOptions: (keyof FeedIcons)[] = ['home', 'custom', 'saved'];