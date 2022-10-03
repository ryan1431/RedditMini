import { faker } from '@faker-js/faker';
import type { Comment, MockPost } from '../mock/mockData';
import * as util from '.';
import subreddits from '../mock/subreddits';
import { uuid } from 'uuidv4';

// eventual reddit json data : https://www.reddit.com/r/WeAreTheMusicMakers/comments/xakvrz/im_a_beginner_songwriter_and_its_the_first_time_i.json


// this next =)
const generateCommentsWithDepth = (initialDepth?: number | null, maxCommentsPerDepth?: number | null):Comment[] | null => {
  // Set args to initials if null/undefined or provided value
  const depth = initialDepth || 0;

  const comments: Comment[] = [];

  // First level of comments
  if (depth === 0) {
    for (let i = 0; i < util.getRandomNumber(maxCommentsPerDepth || 10); i++) {

    }
  }

  return null;
}

const generateComment = ():Comment => {
  const words = Math.ceil(Math.random() * 8);
  const days = Math.ceil(Math.random() * 30);

  const { ups, downs, score } = util.getScore();

  const initialComment = {
    author: faker.internet.userName(),
    comment: faker.lorem.words(words),
    depth: 0,
    ups,
    downs,
    created: new Date(faker.date.recent(days)),
    is_submitter: false,
    score,
    replies: []
  }

  return initialComment; // currently does not include replies
}

const generatePost = ():MockPost => {
  const sentences = Math.ceil(Math.random() * 6);
  const days = Math.ceil(Math.random() * 30);
  const author_is_blocked = Math.ceil(Math.random() * 100) <= 5; 
  const titleWords = Math.ceil(Math.random() * 8);

  const { ups, downs, score } = util.getScore();

  const initialPost = {
    author: faker.internet.userName(),
    author_is_blocked,
    clicked: false,
    avatarUrl: faker.image.avatar(),
    subreddit: util.getRandomFromArray(subreddits),
    id: uuid(),
    title: faker.lorem.words(titleWords),
    selftext: faker.lorem.sentences(sentences),
    created: new Date(faker.date.recent(days)),
    comments: [],
    ups,
    downs,
    score,
    edited: false,
    num_comments: 0,
    over_18: false,
    saved: false,
    spoiler: false,
    subreddit_subscribers: ups,
  }

  return initialPost; // currently does not include comments
}

export {
  generatePost,
  generateComment,
}