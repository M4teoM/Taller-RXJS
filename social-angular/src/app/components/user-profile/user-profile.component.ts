import { Component, Input } from '@angular/core';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    <article class="profile-card">
      <div class="profile-top">
        <img [src]="user.image" [alt]="user.firstName" class="profile-avatar-img" />
        <div>
          <h2 class="profile-name">{{ user.firstName }} {{ user.lastName }}</h2>
          <p class="profile-handle">&#64;{{ user.username }}</p>
          <span class="badge">{{ user.company.title }} · {{ user.company.name }}</span>
        </div>
      </div>

      <div class="profile-meta">
        <article class="meta-box">
          <p class="meta-label">📍 Ciudad</p>
          <p class="meta-value">{{ user.address.city }}</p>
        </article>
        <article class="meta-box">
          <p class="meta-label">✉️ Email</p>
          <p class="meta-value small">{{ user.email }}</p>
        </article>
        <article class="meta-box">
          <p class="meta-label">📞 Teléfono</p>
          <p class="meta-value small">{{ user.phone }}</p>
        </article>
        <article class="meta-box">
          <p class="meta-label">🎂 Edad</p>
          <p class="meta-value">{{ user.age }} años</p>
        </article>
      </div>
    </article>
  `,
  styles: [`
    .profile-avatar-img {
      width: 62px;
      height: 62px;
      border-radius: 999px;
      object-fit: cover;
      border: 3px solid var(--accent);
    }
    .small { font-size: 0.78rem !important; }
    .profile-meta { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  `]
})
export class UserProfileComponent {
  @Input({ required: true }) user!: User;
}
