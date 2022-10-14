interface PostType {
  subreddit: string,
  selftext: string,
  saved: boolean,
  clicked: boolean,
  title: string,
  upvote_ratio: number,
  total_awards_received: number,
  score: number,
  edited: boolean,
  is_self: boolean,
  selftext_html: string,
  over_18: boolean,
  spoiler: boolean,
  visited: boolean,
  author: string,
  num_comments: number,
  created_utc: number,
  is_video: boolean,
  url: string
}

export type {
  PostType
}