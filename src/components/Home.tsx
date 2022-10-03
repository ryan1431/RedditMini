import { useEffect, useState } from "react";

interface HomeProps {
  user?: string | null
}

const fetchJson = async () => {
  const response = await fetch('https://www.reddit.com/r/productivity/comments/xurmsp/not_productive_enough.json');
  const data = await response.json();
  
  return data;

}

export const Home = (props: HomeProps) => {

  const [redditJson, setRedditJson] = useState<string>('');

  useEffect(() => {
    fetchJson().then((res) => {
      setRedditJson(res);
    }).catch((err) => {
      console.log(err);
    })
  }, [])

  return (
    <>
      <pre>
        {redditJson && JSON.stringify(redditJson, null, 2)}
      </pre>
      
    </>
  )
}