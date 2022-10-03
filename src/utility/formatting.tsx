
/** Recursively remove unneeded key-value fields from an array of comment objects & replies
 * 
 * @param commentsArray Array of comments to format
 * @returns Array of formatted comments
 */
 const formatComments = (commentsArray: any) => {
  return commentsArray.map((comment: { data: Object} ) => {
    // Remove 'data' nesting level
    return comment.data; 
  }).map((comment: any) => {
    let { 
      author, body, body_html, collapsed, created_utc, 
      depth, is_submitter, permalink, score, replies
    } = comment;
    
    // Recursively format any nested replies
    if (replies) {
      replies = formatComments(replies.data.children);
    }

    // Return new object with select fields
    return { 
      author, body, body_html, collapsed,
      created_utc, depth, is_submitter, 
      permalink, score, replies
    }
  });
}

/** Decodes _html values from reddit json responses
 * 
 * @param html Encoded html
 * @returns Decoded html
 */
const decodeHtml = (html:string) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}


export { 
  formatComments,
  decodeHtml,
}