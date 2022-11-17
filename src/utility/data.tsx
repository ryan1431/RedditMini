import { PostType } from "../types/postType";

export const keys = [
  'subreddit', 'selftext', 'saved', 'clicked', 'title',
  'upvote_ratio', 'total_awards_received', 'score', 'edited',
  'is_self', 'created_utc', 'selftext_html', 'over_18',
  'spoiler', 'visited', 'author', 'num_comments', 'is_video', 'url',
  'preview', 'media', 'removal_reason', 'removed_by', 'removed_by_category',
  'permalink', 'subreddit_name_prefixed', 'name',
];

export const base = 'https://www.reddit.com/';
export const oauthbase = 'https://oauth.reddit.com';
export const redirect = 'http://localhost:3000';

export const samplePostUrls = [
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

export const samplePost = {
  author: "TreatThompson",
  clicked: false,
  created_utc: 1664813085,
  edited: false,
  is_self: true,
  is_valid: true,
  link: "https://www.reddit.com/r/getdisciplined/comments/xuni6b/wisdom_from_the_elderly_is_like_a_cheat_code/",
  media: null,
  num_comments: 55,
  over_18: false,
  permalink: "/r/getdisciplined/comments/xuni6b/wisdom_from_the_elderly_is_like_a_cheat_code/",
  removal_reason: null,
  removed_by: null,
  removed_by_category: null,
  saved: false,
  score: 491,
  selftext: "Advice from the elderly can save you a lifetime of questioning. They have answers that would have otherwise taken decades to reach on your own.\n\nI remember in high school, people in university would give me advice, and I'd just throw it in the trash. However, when I finally got to university, I regretted not listening to them because I reached the same conclusions, then passed it on to younger people I knew.\n\n**Why did I regret it if I learned it in the end? Because it took years to learn.**\n\nAfter experiencing that, I started looking at people older than me as assets.\n\n**When I see an old man crossing the street, it's hard for me not to see decades upon decades of walking experience.**\n\nAsking him for advice is like going into the future, getting my answer, and coming back. **He lived through my question, so now I don't have to.**\n\nOf course, some advice degrades over time, but that doesn't take away from the fact that there is still timeless information you can tap into.\n\nWith all that being said, it’s no surprise I got excited when I found an article that surveyed elderly peoples most common regrets.\n\nThese are the top 3:\n\n**Family time**\n\nA huge regret elderly people have is not spending more time with their family. The busy 30-year-old who can't make time to see their parents will wish for that time back when they're gone.\n\n**Living safe and practical**\n\nTowards the end of life, many people regret not starting a business or travelling the world. They regret playing it safe and dedicating themselves to saving for retirement.\n\n**Live life now**\n\nSpending your last six months completing your bucket list stains your dreams with sadness and regret. Don't wait until it's too late. Experience life and create memories now.\n\n**\\*\\*\\*\\*\\*\\*\\*\\*\\*\\***\n\nThis post was from my [newsletter](https://www.treatthompson.com/newsletter)\n\nI share ideas from great thinkers so we can stand on the shoulders of giants, instead of figuring life out alone",
  selftext_html: "<!-- SC_OFF --><div class=\"md\"><p>Advice from the elderly can save you a lifetime of questioning. They have answers that would have otherwise taken decades to reach on your own.</p>\n\n<p>I remember in high school, people in university would give me advice, and I&#39;d just throw it in the trash. However, when I finally got to university, I regretted not listening to them because I reached the same conclusions, then passed it on to younger people I knew.</p>\n\n<p><strong>Why did I regret it if I learned it in the end? Because it took years to learn.</strong></p>\n\n<p>After experiencing that, I started looking at people older than me as assets.</p>\n\n<p><strong>When I see an old man crossing the street, it&#39;s hard for me not to see decades upon decades of walking experience.</strong></p>\n\n<p>Asking him for advice is like going into the future, getting my answer, and coming back. <strong>He lived through my question, so now I don&#39;t have to.</strong></p>\n\n<p>Of course, some advice degrades over time, but that doesn&#39;t take away from the fact that there is still timeless information you can tap into.</p>\n\n<p>With all that being said, it’s no surprise I got excited when I found an article that surveyed elderly peoples most common regrets.</p>\n\n<p>These are the top 3:</p>\n\n<p><strong>Family time</strong></p>\n\n<p>A huge regret elderly people have is not spending more time with their family. The busy 30-year-old who can&#39;t make time to see their parents will wish for that time back when they&#39;re gone.</p>\n\n<p><strong>Living safe and practical</strong></p>\n\n<p>Towards the end of life, many people regret not starting a business or travelling the world. They regret playing it safe and dedicating themselves to saving for retirement.</p>\n\n<p><strong>Live life now</strong></p>\n\n<p>Spending your last six months completing your bucket list stains your dreams with sadness and regret. Don&#39;t wait until it&#39;s too late. Experience life and create memories now.</p>\n\n<p><strong>*********\\</strong>*</p>\n\n<p>This post was from my <a href=\"https://www.treatthompson.com/newsletter\">newsletter</a></p>\n\n<p>I share ideas from great thinkers so we can stand on the shoulders of giants, instead of figuring life out alone</p>\n</div><!-- SC_ON -->",
  spoiler: false,
  subreddit: "getdisciplined",
  subreddit_name_prefixed: "r/getdisciplined",
  title: "Wisdom from the elderly is like a cheat code [Discussion]",
  total_awards_received: 3,
  type: "text",
  upvote_ratio: 0.94,
  url: "https://www.reddit.com/r/getdisciplined/comments/xuni6b/wisdom_from_the_elderly_is_like_a_cheat_code/",
  visited: false,
} as PostType;



/* info
https://www.reddit.com/wiki/rss/
problem: link not available
https://www.reddit.com/r/worldnews/comments/yd5yiz/brittney_griner_lost_appeal_will_serve_9_years_in/
/r/wtf+home.json
https://www.reddit.com/search/?q=wtf&type=sr
*/