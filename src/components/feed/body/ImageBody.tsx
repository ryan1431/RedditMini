import { decodeHtml } from "../../../utility"

export const ImageBody = ({url}: {url: string}) => {

  url = decodeHtml(url);
  
  return (
    <>
      <a href={url} target={'_blank'}><img src={url}></img></a>
    </>
  )
}