export const getRandomFromArray = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Define custom .type property of post (video, text, or image)
export const setType = (post: any) => {
  post.type = 
    (post.media 
      || post.preview?.images[0].variants.mp4
      || post.preview?.images[0].variants.gif) ? 'video' :
    post.preview ? 'image' 
    : 'text';
}  

export * from './fetch-format'
export * from './types'