import { PostType, setType } from ".";
import { base, keys } from './data';


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
export const formatPost = (res: any, single = true): PostType => {

  // Extract related data
  let postData = single ? res[0].data.children[0].data : res.data;

  // Filter out any unneeded key-value pairs
  const postEntries:any = Object.fromEntries(
      Object.entries(postData).filter(([key]) => {
        return keys.includes(key);
    })
  );

  // Filter out removed posts
  postEntries.is_valid = true;
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

      if (!url) postEntries.is_valid = false;
      postEntries.content_url = htmlDecode(url)
    }
  }

  return {...postEntries};
}

/** Returns an array of valid posts fetched from provided url
 * 
 * @param url eg. 'https://reddit.com/'
 * @returns array of posts
 */
export const getFeedPosts = async (url: string): Promise<{posts: PostType[], after: string}> => {
  const response = await fetch(formatUrl(url));
  const data = await response.json();
  const after = data.data.after;

  // Map each child
  const posts = data.data.children
    .map((child:any) => formatPost(child, false))
    .filter((p:PostType) => p.is_valid);

  return {
    posts,
    after
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
  // return !url.slice(-4).includes('json') ? `${url}.json` : url
  if (!url.includes('.json')) {
    let query = url.indexOf('?');
    url = (query === -1) 
      ? `${url}.json`
      : `${url.slice(0, query)}.json${url.slice(query)}`
  }
  return url;
}

/** Decodes the provided url. eg. '&amp;' -> '&'
 * 
 *  Use before fetching
 * @param input Url to be decoded
 * @returns Decoded url 
 */
export const htmlDecode = (input:string) => {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

/** Builds a url from the provided queries
 * 
 * @param feed home or custom
 * @param subs list of subreddits
 * @param after optional after token for reddit query
 * @param sort sort query (hot, new, rising, etc)
 * @returns Properly structured url from provided queries
 */
export const buildUrl = (feed: string, subs: string[], after: string, sort: string) => {
  let url = base;
  // Home feed url
  if (feed === 'home') {
    url += `${sort}`

  // Custom (subreddits) mixed feed
  } else if (feed === 'custom') {
    if (!subs.length) throw new Error('nosub');
    url += `r/${subs.join('+')}/${sort}`
  }
  url += `?limit=10&after=${after}`;
  console.log('url: ' + url);
  return url;
}