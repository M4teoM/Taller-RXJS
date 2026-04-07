import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PostWithComments } from '../../interfaces/post-with-comments.interface';

@Component({
  selector: 'app-user-posts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section>
      <h2 class="section-title">Publicaciones ({{ postsWithComments.length }})</h2>

      <div class="post-grid">
        @for (item of postsWithComments; track item.post.id; let index = $index) {
          <article class="post-card" [style.animation-delay]="(index * 70) + 'ms'">

            <h3 class="post-title">{{ item.post.title }}</h3>
            <p class="post-content">{{ item.post.body }}</p>

            <!-- Tags -->
            <div class="post-tags">
              @for (tag of item.post.tags; track tag) {
                <span class="tag">#{{ tag }}</span>
              }
            </div>

            <!-- Reacciones  -->
            <div class="reactions">
              <span class="reaction like">
                <i class="bi bi-hand-thumbs-up-fill"></i> {{ item.post.reactions.likes }}
              </span>
              <span class="reaction dislike">
                <i class="bi bi-hand-thumbs-down-fill"></i> {{ item.post.reactions.dislikes }}
              </span>
              <span class="reaction views">
                <i class="bi bi-eye-fill"></i> {{ item.post.views }}
              </span>
            </div>

            <!-- Comentarios -->
            <div class="comments">
              <p class="comments-label">💬 {{ item.comments.length }} comentario(s)</p>
              @for (comment of item.comments; track comment.id) {
                <div class="comment">
                  <span class="comment-author">{{ comment.user.fullName }}</span>
                  <span class="comment-username">&#64;{{ comment.user.username }}</span>
                  <p class="comment-body">{{ comment.body }}</p>
                </div>
              }
            </div>

          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .post-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin: 0.5rem 0; }
    .tag {
      font-size: 0.72rem; color: var(--accent);
      background: rgba(239,127,69,0.1);
      padding: 0.1em 0.5em; border-radius: 20px; font-weight: 600;
    }
    .reactions { display: flex; gap: 1rem; margin: 0.5rem 0; font-size: 0.85rem; font-weight: 600; }
    .like { color: #16a34a; }
    .dislike { color: #dc2626; }
    .views { color: var(--muted); }
    .comments { border-top: 1px solid var(--line); margin-top: 0.75rem; padding-top: 0.6rem; }
    .comments-label { font-size: 0.8rem; font-weight: 700; color: var(--muted); margin: 0 0 0.5rem; }
    .comment {
      background: rgba(0,0,0,0.03); border-radius: 8px;
      padding: 0.5rem 0.7rem; margin-bottom: 0.4rem;
    }
    .comment-author { font-weight: 700; font-size: 0.82rem; }
    .comment-username { font-size: 0.75rem; color: var(--accent); margin-left: 0.3rem; }
    .comment-body { margin: 0.25rem 0 0; font-size: 0.83rem; color: var(--muted); line-height: 1.4; }
  `]
})
export class UserPostsComponent {
  @Input({ required: true }) postsWithComments!: PostWithComments[];
}
