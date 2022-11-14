import './Subreddits.css';

import type { CSS } from './Home';
import { useAppSelector } from '../app/hooks/hooks';
import { Sub } from './sub/Sub';
import { Search } from './Search';

interface SubredditsProps extends CSS {}

export type size = '' | '0';

export const Subreddits = (props: SubredditsProps) => {
  const { basis, border } = props;

  const subs = useAppSelector((state) => state.subreddits.subs);

  return (
    <>
      <div id="subreddits" style={{flexBasis: basis, maxWidth: basis, border: border}}>
        <div id='search-bar'  >
          <Search />
        </div>

        <div id="selected-subs">
          {subs.map((sub) => (
            <div key={`sub-${sub.name}`} 
              className={`sub ${sub.name}`}>
              <Sub sub={sub} />
            </div>
          ))}
        </div>
      </div>
      
    </>
  )
}
