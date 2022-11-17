interface TextProps {
  selftext: string,
  selftext_html: string,
}

export const TextBody = (props: TextProps) => {
  const { selftext_html: html } = props;

  return (
    <>
      <div dangerouslySetInnerHTML={{__html: html}} />
    </>
  )
}