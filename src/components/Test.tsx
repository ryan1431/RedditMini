import React, { useCallback } from "react";
import { useState } from "react";
import { useAppDispatch } from "../app/hooks/hooks";
import { fetchComments } from "../app/reducers/commentsSlice";
import { Comment } from "../types/commentType";
import { getSinglePost, formatComments, formatPost, PostType } from '../utility/';
import './Test.css';

const Test = () => {
  const dispatch = useAppDispatch();  
  
  const [url, setUrl] = useState<string>('');
  const [post, setPost] = useState<string | PostType>('');
  const [comments, setComments] = useState<Comment[] | null>();

  const updateUrlField = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUrl(value);
  }, [])

  // Will only log full object
  const logObject = useCallback(() => {
    getSinglePost(url).then(res => {
      console.log(res);
    })
  }, [url])

  // Log the formatted response object
  const logPretty = useCallback(() => {
    getSinglePost(url).then(res => {
      console.log(formatPost(res));
      console.log(formatComments(res));
    })
  }, [url])

  const handleFetch = useCallback((e: any) => {
    const { value } = e.target;

    getSinglePost(url).then(res => {
      if (value === 'Format') {
        setPost(formatPost(res));
        setComments(formatComments(res));
      } else {
        setPost(res);
        setComments(null);
      }
    }).catch(err => {
    })
  }, [url]);

  const onDispatch = useCallback(() => {
    console.log('ondispatch');
    dispatch(fetchComments({
      url: 'https://www.reddit.com/r/news/comments/jptqj9/?depth=3',
      postId: 't3_jptqj9',
    }));
  }, [dispatch]);

  return (
    <div id='test-form'>
      <h2>url:</h2>
      <input name='text' type='text' value={url} onChange={updateUrlField}></input>
      <br></br>
      <div>  
        <input name='text' type='button' value='Fetch All' onClick={handleFetch}></input>
        <input type='button' value='Format' onClick={handleFetch}></input>
        <input type='button' value='Log' onClick={logObject}></input>
        <input type='button' value='Log Pretty' onClick={logPretty}></input>
        <input type='button' value='dpstch commnts' onClick={onDispatch}></input>

      </div>      
      <br></br>
      <hr></hr>
      <pre id="display-text">
        {post ? `post: 
        ${JSON.stringify(post, null, 2)}
        ` : 'Enter url to preview'}
        {comments && `comments: 
        ${JSON.stringify(comments, null, 2)}`}
      </pre>
    </div>
  )
}

export {
  Test,
}