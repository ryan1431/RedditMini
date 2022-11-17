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
  name: string,
  author: string,
  num_comments: number,
  created_utc: number,
  url: string
  type: string | undefined,
  preview: any,
  media: any,
  removal_reason: any,
  removed_by: any,
  removed_by_category: any,
  is_valid?: boolean,
  content_url: string,
  permalink: string,
  subreddit_name_prefixed: string, 
  /**
   * Link to original post on Reddit
   */
  link: string,
}

export type {
  PostType
}