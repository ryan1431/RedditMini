import { CommentData } from '../../types/commentType';
import './Comment.css';

interface CommentProps {
  comment: CommentData,
}

export const Comment = ({comment}: CommentProps) => {

  
  return (
    <div className='comment' dangerouslySetInnerHTML={{__html: comment.body_html}} />
  )
}