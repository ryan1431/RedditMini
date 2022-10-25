import { decodeHtml } from '../../../utility';

interface TextProps {
  selftext: string,
  selftext_html: string,
}

export const TextBody = (props: TextProps) => {

  const { selftext_html } = props;
  const html = decodeHtml(selftext_html);

  return (
    <>
      <div dangerouslySetInnerHTML={{__html: html}} />
    </>
  )
}