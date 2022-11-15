import './Subreddits.css';

import type { CSS } from './Home';
import { useAppSelector } from '../app/hooks/hooks';
import { Sub } from './sub/Sub';
import { Search } from './Search';

interface SubredditsProps extends CSS {}

export const Subreddits = (props: SubredditsProps) => {
  const { basis, border } = props;
  const subs = useAppSelector((state) => state.subreddits.subs);

  return (
    <div id="subreddits" style={{flexBasis: basis, maxWidth: basis, border: border}}>
      <div className='subs-results-container'> 
        <div id='search-bar'  >
          <Search />
        </div>

        <div id="selected-subs">
          {subs.map((sub) =>
            <Sub sub={sub} key={'selected-' + sub.name}/>
          )}
        </div>
      </div>
    </div>
  )
}
