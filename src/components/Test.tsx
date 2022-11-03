import React from "react";
import { useState } from "react";
import { fetchData, formatComments, formatPost, formatUrl, PostType } from '../utility/';
import './Test.css';

const Test = () => {
  const [url, setUrl] = useState<string>('');
  const [post, setPost] = useState<string | PostType>('');
  const [comments, setComments] = useState('');

  const updateUrlField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUrl(value);
  }

  // Will only log full object
  const logObject = () => {
    fetchData(formatUrl(url)).then(res => {
      console.log(res);
    })
  }

  // Log the formatted response object
  const logPretty = () => {
    fetchData(formatUrl(url)).then(res => {
      console.log(formatPost(res));
      console.log(formatComments(res));
    })
  }

  const handleFetch = (e: any) => {
    const { value } = e.target;

    fetchData(formatUrl(url)).then(res => {
      if (value === 'Format') {
        setPost(formatPost(res));
        setComments(formatComments(res));
      } else {
        setPost(res);
        setComments('');
      }
    }).catch(err => {
      console.log(err);
    })
  }

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