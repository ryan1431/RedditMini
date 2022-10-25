import { decodeHtml } from "../../../utility"

export const ImageBody = ({url}: {url: string}) => {

  url = decodeHtml(url);
  
  return (
    <>
      <a href={url} rel='noreferrer' target={'_blank'}><img src={url} alt='reddit content'></img></a>
    </>
  )
}