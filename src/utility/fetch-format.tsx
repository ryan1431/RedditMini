import { PostType, setType } from ".";
import { CommentType } from "../types/commentType";
import { keys } from './data';

/** Recursively format & remove unneeded key-value fields from an array of comment objects & replies
 * 
 * @param commentsArray Array of comments to format
 * @returns Array of formatted comments
 */
 export const formatCommentsRecursive = (commentsArray: any) => {
  return commentsArray.map(({kind, data}:any) => {
    if (kind === 'more') return { kind, data }

    let { 
      author, distinguished, id, body, body_html, collapsed, created_utc, depth, is_submitter, permalink, score, replies, subreddit
    } = data;
    
    // Recursive case
    if (replies) {
      replies = formatCommentsRecursive(replies.data.children);
    }

    // Return new object with select fields
    return { 
      kind,
      data: {
        author, distinguished, id, body, body_html, collapsed, created_utc, depth, is_submitter, permalink, score, replies, subreddit
      }
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
      // postEntries.content_url = htmlDecode(postEntries.preview.images[0].source.url)
      postEntries.content_url = postEntries.preview.images[0].source.url;
    } else { // is video
      let url:string = 
        postEntries.media?.reddit_video?.fallback_url
        || postEntries.preview?.images[0]?.variants?.mp4?.source?.url
        || postEntries.preview?.images[0]?.variants?.gif?.source?.url
        || null;

      if (!url) postEntries.is_valid = false;
      // postEntries.content_url = htmlDecode(url)
      postEntries.content_url = url;
    }
  }

  // Set persistent link
  postEntries.link = `https://www.reddit.com${postEntries.permalink}`;

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

/** Fetches (get) data from provided url
 * 
 * @param url Url to fetch
 * @returns Json data from url
 */
 export const getSinglePost = async (url: string) => {
  try {
    const response = await fetch(`${formatUrl(url)}`);
    const data = await response.json();
    return data;
  } catch(e) {
  }
}

/** Gets json data of all comments and their replies
 * 
 * @param res Json response object
 * @returns All formatted comments and replies
 */
export const formatComments = (res: any): CommentType[] => {
  return formatCommentsRecursive(res[1].data.children);
}

/** Appends .json to reddit url if it is missing from the url.
 * 
 * Will not modify the string if it already has .json appended to it
 * @param url Url string to be modified
 * @returns Url string with .json appended
 */
export const formatUrl = (url: string) => {
  let queryIndex = url.indexOf('?');
  if (!url.includes('.json')) {
    url = (queryIndex === -1) 
      ? `${url}.json`
      : `${url.slice(0, queryIndex)}.json${url.slice(queryIndex)}`
  } 
  if (!url.includes('raw_json=1')) {
    url = (queryIndex === -1) 
      ? `${url}?raw_json=1`
      : `${url}&raw_json=1`
  }
  return url;
}
