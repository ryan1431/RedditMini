export const keys = [
  'subreddit', 'selftext', 'saved', 'clicked', 'title',
  'upvote_ratio', 'total_awards_received', 'score', 'edited',
  'is_self', 'created_utc', 'selftext_html', 'over_18',
  'spoiler', 'visited', 'author', 'num_comments', 'is_video', 'url',
  'preview', 'media', 'removal_reason', 'removed_by', 'removed_by_category',
  'permalink', 'subreddit_name_prefixed',
];

export const base = 'https://www.reddit.com/';
export const oauthbase = 'https://oauth.reddit.com';
export const redirect = 'http://localhost:3000';

export const samplePosts = [
  'https://www.reddit.com/r/interestingasfuck/comments/y41z91/shabani_the_gorilla_trying_to_approach_ai_one_of/',
  'https://www.reddit.com/r/suggestmeabook/comments/y3uhib/wellwritten_female_fantasy_characters/',
  'https://www.reddit.com/r/TooAfraidToAsk/comments/xybq61/what_does_it_mean_when_you_feel_like_you_are/',
  'https://www.reddit.com/r/MadeMeSmile/comments/y9ph5o/today_i_celebrate_one_thousand_days_sober_they/',
  'https://www.reddit.com/r/simpleliving/comments/y9njjm/if_you_could_go_back_in_time_and_not_change_a/',
  'https://www.reddit.com/r/leagueoflegends/comments/ybzh2z/drx_vs_edward_gaming_2022_world_championship/',
];

export const sortFields = [
  ['best', 'Best'],
  ['hot', 'Hot'],
  ['new', 'New'],
  ['top', 'Top'],
  ['rising', 'Rising']
];

export const feedFields = [
  ['home', 'Home'],
  ['custom', 'Custom'],
  ['saved', 'Saved'],
];




/* info
https://www.reddit.com/wiki/rss/
problem: link not available
https://www.reddit.com/r/worldnews/comments/yd5yiz/brittney_griner_lost_appeal_will_serve_9_years_in/
/r/wtf+home.json
r/subreddits/search?q=${query}&sort=hot
*/