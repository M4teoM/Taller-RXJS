import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Subject, catchError, debounceTime,
  distinctUntilChanged, map, of, switchMap, tap
} from 'rxjs';
import { PostWithComments } from './interfaces/post-with-comments.interface';
import { User } from './interfaces/user.interface';
import { UserService } from './services/user.service';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserPostsComponent } from './components/user-posts/user-posts.component';
@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, UserProfileComponent, UserPostsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  readonly searchControl = new FormControl('', { nonNullable: true });

  user: User | null = null;
  postsWithComments: PostWithComments[] = [];
  loading = false;
  notFound = false;

  private readonly search$ = new Subject<string>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap((query) => {
          this.notFound = false;
          this.user = null;
          this.postsWithComments = [];
          this.loading = !!query.trim();
        }),
        switchMap((query) => {
          if (!query.trim()) return of(null);

          return this.userService.getUserByUsername(query).pipe(
            switchMap((user) => {
              if (!user) return of({ user: null, postsWithComments: [] as PostWithComments[] });

              return this.userService.getPostsWithComments(user.id).pipe(
                catchError(() => of([] as PostWithComments[])),
                map((pwc) => ({ user, postsWithComments: pwc }))
              );
            }),
            catchError(() => of({ user: null, postsWithComments: [] as PostWithComments[] }))
          );
        })
      )
      .subscribe((result) => {
        this.loading = false;
        if (!result) return;
        this.user = result.user;
        this.postsWithComments = result.postsWithComments;
        this.notFound = !result.user && !!this.searchControl.value.trim();
      });

    // Conecta el FormControl con el Subject
    this.searchControl.valueChanges.subscribe((v) => this.search$.next(v.trim().toLowerCase()));
  }
}
