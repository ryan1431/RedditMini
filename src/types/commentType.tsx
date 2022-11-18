export interface MoreComments {
  /**
   * An array of comment id's for further fetching 
   */
  children: string[],
  count: number,
  depth: number,
  /**
   * l
   */
  id: string,
  /**
   * id with t#_ prefix
   */
  name: string,
  /**
   * The parent comment's id (one depth level upwards)
   */
  parent_id: string,
}

export interface CommentData {  
  /**
   * The commenter's username
   */
  author: string,
  /**
   * Identifies moderators
   */
  distinguished: string,
  id: string,
  body: string,
  body_html: string,
  collapsed: boolean,
  created_utc: number,
  /**
   * This comment's depth within the root chain
   */
  depth: number,
  /**
   * Boolean representing if the commenter is OP
   */
  is_submitter: boolean,
  /**
   * /r/link
   */
  permalink: string,
  /**
   * Precalculated score (upvotes - downvotes)
   */
  score: number,
  /**
   * The name of the subreddit alone, without r/ prefix
   */
  subreddit: string,
  replies: CommentType[]
}

export interface CommentType {
  /**
   * @param t1 - represents a comment type
   * 
   * @param more - represents an array of comment ids to be fetched (when request limit reached)
   *      - includes metadata about replies, depth, parent comment id
   */
  kind: 't1' | 'more',
  data: CommentData | MoreComments;
}