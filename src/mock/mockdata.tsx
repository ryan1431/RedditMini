import { type } from "@testing-library/user-event/dist/types/setup/directApi";



interface Comment {
  author: string,
  comment: string,
  depth: number,
  ups: number,
  downs: number,
  created: Date,
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
  id: string,
  title: string,
  selftext: string,
  created: Date,
  comments: Comment[],
  ups: number,
  downs: number,
  edited: boolean,
  num_comments: number,
  over_18: boolean,
  saved: boolean,
  spoiler: boolean,
  subreddit_subscribers: number,
}

// const mockPosts: MockPost[] = [
//   {
    
//   }
// ]

export type {
  Comment,
  MockPost,
}