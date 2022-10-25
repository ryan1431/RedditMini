import React, { useCallback } from "react";
import { useState } from "react";
import uuid from 'react-uuid';


import { fetchData, formatComments, formatPost, formatUrl, PostType } from '../utility/';
import { redirect } from "../utility/data";

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

  /* 
  https://www.reddit.com/api/v1/authorize?client_id=CLIENT_ID&response_type=TYPE&
    state=RANDOM_STRING&redirect_uri=URI&duration=DURATION&scope=SCOPE_STRING
  */

  const getData = async () => {
    const state = uuid();
    let response = await fetch(`https://www.reddit.com/api/v1/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&state=${state}&redirect_uri=${redirect}&duration=temporary&scope=read`, {mode: 'cors'})
    return response;
  }

  const authenticate = useCallback(() => {
    getData().then((res: any) => {
      console.log(res);
    });
  }, [])

  return (
    <div id='test-form'>

      {/* <video ref={vidRef} loop={true} controls>
        <source src="https://external-preview.redd.it/14iVLf3JV44dgN7BypeQUFjRoB9zWMKkvstHRlFrx1Q.gif?width=640&amp;format=mp4&amp;s=4cd1255782ca397d5b89bd39f9c735ede41b62cc"/>
      </video> */}

      <h2>url:</h2>
      <input name='text' type='text' value={url} onChange={updateUrlField}></input>
      <br></br>
      <div>  
        <input name='text' type='button' value='Fetch All' onClick={handleFetch}></input>
        <input type='button' value='Format' onClick={handleFetch}></input>
        <input type='button' value='Log' onClick={logObject}></input>
        <input type='button' value='Log Pretty' onClick={logPretty}></input>
        <input type='button' value='Authenticate' onClick={authenticate}></input>
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