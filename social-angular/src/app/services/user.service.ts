import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import { Comment } from '../interfaces/comment.interface';
import { Post } from '../interfaces/post.interface';
import { PostWithComments } from '../interfaces/post-with-comments.interface';
import { User } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = 'https://dummyjson.com';

  constructor(private http: HttpClient) {}

  getUserByUsername(username: string): Observable<User | null> {
    return this.http
      .get<{ users: User[] }>(`${this.baseUrl}/users`)
      .pipe(
        map((res) => res.users.find(
          (u) => u.username.toLowerCase() === username.toLowerCase()
        ) ?? null)
      );
  }

  getPostsWithComments(userId: number): Observable<PostWithComments[]> {
    return this.http
      .get<{ posts: Post[] }>(`${this.baseUrl}/posts/user/${userId}`)
      .pipe(
        map((res) => res.posts),
        mergeMap((posts) => {
          if (posts.length === 0) return of([]);

          const requests = posts.map((post) =>
            this.http
              .get<{ comments: Comment[] }>(`${this.baseUrl}/comments/post/${post.id}`)
              .pipe(map((res): PostWithComments => ({ post, comments: res.comments })))
          );

          return forkJoin(requests);
        })
      );
  }
}
