import { PostType } from "./types";

const keys = [
  'subreddit', 'selftext', 'saved', 'clicked', 'title',
  'upvote_ratio', 'total_awards_received', 'score', 'edited',
  'is_self', 'created_utc', 'selftext_html', 'over_18',
  'spoiler', 'visited', 'author', 'num_comments', 'is_video', 'url',
  'preview'
];

/** Recursively format & remove unneeded key-value fields from an array of comment objects & replies
 * 
 * @param commentsArray Array of comments to format
 * @returns Array of formatted comments
 */
 export const formatCommentsRecursive = (commentsArray: any) => {
  // Remove 'data' nesting level
  return commentsArray.map((comment: { data: Object} ) => {
    return comment.data; 

  // Select fields from json object
  }).map((comment: any) => {
      let { 
        author, body, body_html, collapsed, created_utc, 
        depth, is_submitter, permalink, score, replies
      } = comment;
      
      // Recursive case
      if (replies) {
        replies = formatCommentsRecursive(replies.data.children);
      }

      // Return new object with select fields
      return { 
        author, body, body_html, collapsed,
        created_utc, depth, is_submitter, 
        permalink, score, replies
      }
  });
}

/** Formats .json() response from Reddit .json data
 * 
 * @param res Json response object
 * @returns Formatted object as: { post, comments }
 */
export const formatPost = (res: any): any => {
  // Original post object
  const postData = res[0].data.children[0].data;

  // Filter out any unneeded key-value pairs
  const post = Object.fromEntries(
      Object.entries(postData).filter(([key]) => {
        return keys.includes(key);
    })
  );

  // Comments array
  
  
  return {
    ...post
    // comments,
  }
}

/** Gets json data of all comments and their replies
 * 
 * @param res Json response object
 * @returns All formatted comments and replies
 */
export const formatComments = (res: any) => {
  return formatCommentsRecursive(res[1].data.children);
}



/** Decodes _html values from reddit json responses
 * 
 * @param html Encoded html
 * @returns Decoded html
 */
export const decodeHtml = (html:string) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

/** Fetches (get) data from provided url
 * 
 * @param url Url to fetch
 * @returns Json data from url
 */
export const fetchData = async (url: string) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch(e) {
    console.log(e);
    return 'Invalid request url.';
  }
}

/** Appends .json to reddit url if it is missing from the url.
 * 
 * Will not modify the string if it already has .json appended to it
 * @param url Url string to be modified
 * @returns Url string with .json appended
 */
export const formatUrl = (url: string) => {
  return !url.slice(-4).includes('json') ? `${url}.json` : url
}
