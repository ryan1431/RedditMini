import { PostType, setType } from ".";

const keys = [
  'subreddit', 'selftext', 'saved', 'clicked', 'title',
  'upvote_ratio', 'total_awards_received', 'score', 'edited',
  'is_self', 'created_utc', 'selftext_html', 'over_18',
  'spoiler', 'visited', 'author', 'num_comments', 'is_video', 'url',
  'preview', 'media', 'removal_reason', 'removed_by', 'removed_by_category'
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
export const formatPost = (res: any): PostType => {
  // Original post object
  const postData = res[0].data.children[0].data;

  // Filter out any unneeded key-value pairs
  const postEntries:any = Object.fromEntries(
      Object.entries(postData).filter(([key]) => {
        return keys.includes(key);
    })
  );

  postEntries.is_valid = true;

  // Filter out removed posts
  if (postEntries.removal_reason || postEntries.removed_by || postEntries.removed_by_category) {
    postEntries.is_valid = false;
  }

  // Set type of post (video/text/image) && post state
  setType(postEntries);
  
  // Set content url for easy access & decode
  if (postEntries.type !== 'text') {
    if (postEntries.type === 'image') {
      postEntries.content_url = htmlDecode(postEntries.preview.images[0].source.url)
      
    } else { // is video
      let url:string = 
        postEntries.media?.reddit_video?.fallback_url
        || postEntries.preview?.images[0]?.variants?.mp4?.source?.url
        || postEntries.preview?.images[0]?.variants?.gif?.source?.url
        || null;

      console.log(url);
      if (!url) postEntries.is_valid = false;
      postEntries.content_url = htmlDecode(url)
    }
  }

  const post: PostType = {...postEntries}
  
  return post;
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

/** Decodes the provided url. eg. '&amp;' -> '&'
 * 
 *  Use before fetching
 * @param input Url to be decoded
 * @returns Decoded url 
 */
export const htmlDecode = (input:string) => {
  var doc = new DOMParser().parseFromString(input, "text/html");
  console.log(doc);
  return doc.documentElement.textContent;
}