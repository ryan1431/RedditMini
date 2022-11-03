export const ImageBody = ({url}: {url: string}) => {

  return (
    <>
      <a href={url} rel='noreferrer' target={'_blank'}><img src={url} alt='reddit content'></img></a>
    </>
  )
}