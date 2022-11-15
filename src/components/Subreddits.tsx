import './Subreddits.css';

import { useAppSelector } from '../app/hooks/hooks';
import { Sub } from './sub/Sub';
import { Search } from './Search';

interface SubredditsProps {
  open: boolean,
}

export const Subreddits = ({open}: SubredditsProps) => {
  const subs = useAppSelector((state) => state.subreddits.subs);

  let width = open ? '' : '0';

  return (
    <div id="subreddits" style={{flexBasis: width, maxWidth: width, border: open ? '' : 'none'}}>
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
