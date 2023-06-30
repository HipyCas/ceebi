export interface PostRawShortenedReq {
  id: number;
  excerpt: {
    rendered: string;
  };
  title: {
    rendered: string;
  };
  link: string;
}

export interface Post {
  id: number;
  excerpt: string;
  title: string;
  link: string;
}
