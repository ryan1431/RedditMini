import { MoreComments } from "../../types/commentType";
import { base } from "../../utility/data";

interface MoreProps {
  data: MoreComments,
  postId: string,
  sub: string,
}

export const More = ({data, postId, sub}: MoreProps) => {
  let link = `${base}r/${sub}/comments/${postId.slice(3)}`
  if (data.parent_id[1] === '1') link += `/comment/${data.parent_id.slice(3)}`
  return (
    <div className='comment-see-more'
      style={{
        left: `${7 + (data.depth * 15)}px`,
      }}  
    >
      <p><a href={link} target='_blank' rel='noreferrer'>{data.count} more repl{data.count === 1 ? 'y' : 'ies'} - view on reddit.com</a></p>
    </div>
  )
}