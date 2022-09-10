import { faker } from '@faker-js/faker';



interface Comment {
  author: string,
  comment: string,
  time: Date,
  depth: number,
  ups: number,
  downs: number,
  created: number,
  is_submitter: boolean, // op ? 
  score: number, // was equal to vote number
  replies: Comment[],
}

interface MockPost {
  author: string,
  author_is_blocked: boolean,
  clicked: boolean,
  avatarUrl: string,
  subreddit: string,
  id: number,
  postTitle: string,
  postBody: string,
  postType: string,
  created: number,
  domain: string,
  comments: Comment[],
  ups: number,
  downs: number,
  edited: boolean,
  num_comments: number,
  over_18: boolean,
  saved: boolean,
  spoiler: boolean,
  subreddit_subscribers: number,
  url: string,

}

// const mockPosts: MockPost[] = [
//   {
    
//   }
// ]

// export {
//   mockPosts,
// }