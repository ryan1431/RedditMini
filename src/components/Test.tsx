import { useState } from "react";
// import { formatComments } from "../utility";

import { formatComments } from '../utility/formatting';

import './Test.css';

const postKeys = [
  'subreddit', 'selftext', 'saved', 'clicked', 'title',
  'upvote_ratio', 'total_awards_received', 'score', 'edited',
  'is_self', 'created_utc', 'selftext_html', 'over_18',
  'spoiler', 'visited', 'author', 'num_comments', 'is_video'
];

const fetchData = async (url: string) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch(e) {
    console.log(e);
    return 'Invalid request url.';
  }
}

const Test = () => {

  const [url, setUrl] = useState<string>('');
  const [data, setData] = useState<string>('');

  const updateUrlField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUrl(value);
  }

  // Will only log full object
  const logObject = () => {
    fetchData(formatUrl()).then(res => {
      console.log(res);
    })
  }

  const logPretty = () => {
    fetchData(formatUrl()).then(res => {
      // Original post object
      const postData = res[0].data.children[0].data;
      // Comments array
      const comments = formatComments(res[1].data.children);

      // Filter out any unneeded key-value pairs
      const post = Object.fromEntries(
          Object.entries(postData).filter(([key]) => {
            return postKeys.includes(key);
        })
      );
      
      console.log({ post, comments });
    })
  }

  // Modify url to include .json at tail if necessary
  const formatUrl = () => {
    return !url.slice(-4).includes('json') ? `${url}.json` : url
  }

  const handleFetch = (e: any) => {
    const { value } = e.target;

    fetchData(formatUrl()).then(res => {
      let data = res;

      if (value === 'Format') {
        // Original post object
        const postData = res[0].data.children[0].data;

        // Filter out any unneeded key-value pairs
        const post = Object.fromEntries(
            Object.entries(postData).filter(([key]) => {
              return postKeys.includes(key);
          })
        );

        // Comments array
        const comments = formatComments(res[1].data.children);
        
        data = {
          post,
          comments,
        }
      }
      
      setData(data);
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
        {data ? JSON.stringify(data, null, 2) : 'Enter url to preview'}
      </pre>
    </div>
  )
}


export {
  Test,
}