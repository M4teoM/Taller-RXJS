import { Comment } from './comment.interface';
import { Post } from './post.interface';

export interface PostWithComments {
  post: Post;
  comments: Comment[];
}
