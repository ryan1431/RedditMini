import { useState } from "react";

import { fetchData, formatComments, formatJsonResponse, formatUrl } from '../utility/fetch-format';

import './Test.css';





const Test = () => {

  const [url, setUrl] = useState<string>('');
  const [data, setData] = useState<string>('');

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
      console.log(formatJsonResponse(res));
    })
  }

  const handleFetch = (e: any) => {
    const { value } = e.target;

    fetchData(formatUrl(url)).then(res => {
      let data = res;

      if (value === 'Format') {
        data = formatJsonResponse(res);
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