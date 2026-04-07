import { AsyncPipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, shareReplay, startWith, tap } from 'rxjs';

// Estructura base de una publicacion mostrada en el panel derecho.
interface Post {
  id: number;
  title: string;
  content: string;
}

// Modelo de usuario con sus datos de perfil y publicaciones.
interface UserProfile {
  id: number;
  name: string;
  handle: string;
  city: string;
  bio: string;
  followers: number;
  following: number;
  role: string;
  verified: boolean;
  color: string;
  posts: Post[];
}

// Datos simulados para mantener la app autocontenida durante el taller.
const USERS: UserProfile[] = [
  {
    id: 1,
    name: 'Ana Torres',
    handle: '@anacode',
    city: 'Medellin',
    bio: 'Frontend engineer. Diseno interfaces limpias y uso RxJS para flujos reactivos.',
    followers: 1240,
    following: 245,
    role: 'Frontend',
    verified: true,
    color: 'linear-gradient(145deg, #ef7f45, #d65c22)',
    posts: [
      {
        id: 101,
        title: 'Patron de busqueda reactiva',
        content: 'Combine debounceTime y distinctUntilChanged para evitar ruido y mejorar UX.',
      },
      {
        id: 102,
        title: 'Accesibilidad en tarjetas',
        content: 'Etiquetas claras, buen contraste y estados visuales para foco y seleccion.',
      },
    ],
  },
  {
    id: 2,
    name: 'Luis Perez',
    handle: '@luisdata',
    city: 'Bogota',
    bio: 'Analista de datos. Me interesa visualizacion, ETL y arquitectura orientada a eventos.',
    followers: 896,
    following: 160,
    role: 'Data',
    verified: false,
    color: 'linear-gradient(145deg, #0f766e, #095750)',
    posts: [
      {
        id: 201,
        title: 'Eventos y trazabilidad',
        content: 'Registrar eventos de usuario ayuda a medir conversion y detectar cuellos de botella.',
      },
      {
        id: 202,
        title: 'Pipelines estables',
        content: 'Validar datos en cada etapa reduce errores silenciosos en produccion.',
      },
    ],
  },
  {
    id: 3,
    name: 'Marta Rios',
    handle: '@martaui',
    city: 'Cali',
    bio: 'Product designer. Diseno sistemas visuales con enfoque en consistencia y velocidad.',
    followers: 1780,
    following: 312,
    role: 'Design',
    verified: true,
    color: 'linear-gradient(145deg, #c5652f, #8e431b)',
    posts: [
      {
        id: 301,
        title: 'Tipografia con personalidad',
        content: 'Evitar stacks genericos da identidad al producto y mejora recordacion.',
      },
      {
        id: 302,
        title: 'Color semantico',
        content: 'Cada color debe comunicar estado, no solo decorar la pantalla.',
      },
    ],
  },
  {
    id: 4,
    name: 'Diego Cano',
    handle: '@diegodev',
    city: 'Barranquilla',
    bio: 'Fullstack developer. APIs simples, contratos claros y componentes faciles de mantener.',
    followers: 650,
    following: 402,
    role: 'Fullstack',
    verified: false,
    color: 'linear-gradient(145deg, #a76419, #7f4a0d)',
    posts: [
      {
        id: 401,
        title: 'API para perfil social',
        content: 'Un endpoint estable para perfil simplifica el frontend y evita llamadas duplicadas.',
      },
      {
        id: 402,
        title: 'Errores manejables',
        content: 'Fallbacks claros mejoran la experiencia cuando falla red o backend.',
      },
    ],
  },
];

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None,
})
export class App {
  // Control reactivo del input de busqueda.
  readonly searchControl = new FormControl('', { nonNullable: true });

  // Estado fuente de usuarios y del usuario seleccionado.
  private readonly users$ = new BehaviorSubject<UserProfile[]>(USERS);
  private readonly selectedUserId$ = new BehaviorSubject<number | null>(null);

  // Exponemos el id seleccionado para pintar estado activo en la lista.
  readonly selectedUserIdSignal = this.selectedUserId$.asObservable().pipe(startWith(null), shareReplay(1));

  // Stream de busqueda: normaliza texto y reduce ruido con debounce.
  readonly search$ = this.searchControl.valueChanges.pipe(
    map((value) => value.trim().toLowerCase()),
    debounceTime(220),
    distinctUntilChanged(),
    startWith(''),
    shareReplay(1),
  );

  // Lista visible segun el query actual; si no hay query, no se muestran resultados.
  readonly filteredUsers$ = combineLatest([this.users$, this.search$]).pipe(
    map(([allUsers, query]) => {
      if (!query) {
        return [];
      }

      return allUsers.filter((user) => {
        const searchableText = `${user.name} ${user.handle} ${user.city} ${user.role}`.toLowerCase();
        return searchableText.includes(query);
      });
    }),
    tap((list) => {
      if (list.length === 0) {
        this.selectedUserId$.next(null);
        return;
      }

      const currentId = this.selectedUserId$.getValue();
      const existsCurrentSelection = list.some((user) => user.id === currentId);

      if (!existsCurrentSelection) {
        this.selectedUserId$.next(list[0].id);
      }
    }),
    shareReplay(1),
  );

  // Conteo de coincidencias para el texto "N resultados".
  readonly resultCount$ = this.filteredUsers$.pipe(map((users) => users.length));

  // Usuario actualmente visible en el detalle (perfil + posts).
  readonly selectedUser$ = combineLatest([this.filteredUsers$, this.selectedUserId$]).pipe(
    map(([visibleUsers, selectedId]) => {
      if (selectedId === null) {
        return null;
      }

      return visibleUsers.find((user) => user.id === selectedId) ?? null;
    }),
  );

  // Cambia el usuario activo cuando se hace click en un item.
  selectUser(id: number): void {
    this.selectedUserId$.next(id);
  }

  // Ayuda de plantilla para marcar visualmente el elemento seleccionado.
  isSelected(id: number, selectedId: number | null): boolean {
    return selectedId === id;
  }

  // Construye iniciales para el avatar circular (ej. Ana Torres -> AT).
  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  // Formatea numeros en notacion compacta local (ej. 1200 -> 1,2 mil).
  formatCompactNumber(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }
}
