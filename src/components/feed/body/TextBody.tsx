import { parse } from 'path';
import { decodeHtml } from '../../../utility';

interface TextProps {
  selftext: string,
  selftext_html: string,
}

export const TextBody = (props: TextProps) => {

  const { selftext, selftext_html } = props;
  const html = decodeHtml(selftext_html);

  console.log(html);
  return (
    <>
      <div dangerouslySetInnerHTML={{__html: html}} />
    </>
  )
}