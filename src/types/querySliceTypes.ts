import { PostType } from "./postType";

export interface CachedPosts {
  best: Cache,
  hot: Cache,
  new: Cache,
  top: Cache,
  rising: Cache,
}

export interface Cache {
  after: string,
  posts: PostType[],
}

export const cachedPosts: CachedPosts = {
  best: {
    after: '',
    posts: [],
  },
  hot: {
    after: '',
    posts: [],
  },
  new: {
    after: '',
    posts: [],
  },
  top: {
    after: '',
    posts: [],
  },
  rising: {
    after: '',
    posts: [],
  },
}

export type Sort = keyof CachedPosts;