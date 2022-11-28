export interface Subreddit {
  name: string,
  icon_url: string
  is_valid: boolean,
}

export interface SubMeta {
  active_user_count: number,
  banner_background_color: string,
  banner_img: string,
  community_icon: string,
  header_img: string,
  icon_img: string,
  id: string,
  public_description: string,
  public_description_html: string,
  display_name: string,
  name: string,
  subscribers: number,
}

export const sampleSubMeta:SubMeta = {
  active_user_count: 1,
  banner_background_color: 'string',
  banner_img: 'string',
  community_icon: 'string',
  header_img: 'string',
  icon_img: 'string',
  id: 'string',
  public_description: 'string',
  public_description_html: 'string',
  display_name: 'string',
  name: 'string',
  subscribers: 3,
}