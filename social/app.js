// Importamos utilidades de RxJS desde CDN para manejar todo de forma reactiva.
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  startWith,
} from "https://esm.sh/rxjs@7.8.2";

// Datos simulados de usuarios y publicaciones para el ejercicio.
const users = [
  {
    id: 1,
    name: "Ana Torres",
    handle: "@anacode",
    city: "Medellin",
    bio: "Frontend engineer. Diseno interfaces limpias y uso RxJS para flujos reactivos.",
    followers: 1240,
    following: 245,
    role: "Frontend",
    verified: true,
    color: "linear-gradient(145deg, #ef7f45, #d65c22)",
    posts: [
      {
        id: 101,
        title: "Patron de busqueda reactiva",
        content: "Combine debounceTime y distinctUntilChanged para evitar ruido y mejorar UX.",
      },
      {
        id: 102,
        title: "Accesibilidad en tarjetas",
        content: "Etiquetas claras, buen contraste y estados visuales para foco y seleccion.",
      },
    ],
  },
  {
    id: 2,
    name: "Luis Perez",
    handle: "@luisdata",
    city: "Bogota",
    bio: "Analista de datos. Me interesa visualizacion, ETL y arquitectura orientada a eventos.",
    followers: 896,
    following: 160,
    role: "Data",
    verified: false,
    color: "linear-gradient(145deg, #0f766e, #095750)",
    posts: [
      {
        id: 201,
        title: "Eventos y trazabilidad",
        content: "Registrar eventos de usuario ayuda a medir conversion y detectar cuellos de botella.",
      },
      {
        id: 202,
        title: "Pipelines estables",
        content: "Validar datos en cada etapa reduce errores silenciosos en produccion.",
      },
    ],
  },
  {
    id: 3,
    name: "Marta Rios",
    handle: "@martaui",
    city: "Cali",
    bio: "Product designer. Diseno sistemas visuales con enfoque en consistencia y velocidad.",
    followers: 1780,
    following: 312,
    role: "Design",
    verified: true,
    color: "linear-gradient(145deg, #c5652f, #8e431b)",
    posts: [
      {
        id: 301,
        title: "Tipografia con personalidad",
        content: "Evitar stacks genericos da identidad al producto y mejora recordacion.",
      },
      {
        id: 302,
        title: "Color semantico",
        content: "Cada color debe comunicar estado, no solo decorar la pantalla.",
      },
    ],
  },
  {
    id: 4,
    name: "Diego Cano",
    handle: "@diegodev",
    city: "Barranquilla",
    bio: "Fullstack developer. APIs simples, contratos claros y componentes faciles de mantener.",
    followers: 650,
    following: 402,
    role: "Fullstack",
    verified: false,
    color: "linear-gradient(145deg, #a76419, #7f4a0d)",
    posts: [
      {
        id: 401,
        title: "API para perfil social",
        content: "Un endpoint estable para perfil simplifica el frontend y evita llamadas duplicadas.",
      },
      {
        id: 402,
        title: "Errores manejables",
        content: "Fallbacks claros mejoran la experiencia cuando falla red o backend.",
      },
    ],
  },
];

// Referencias al DOM principal.
const searchInput = document.getElementById("searchInput");
const userList = document.getElementById("userList");
const profileCard = document.getElementById("profileCard");
const postGrid = document.getElementById("postGrid");
const resultCount = document.getElementById("resultCount");

// Validacion defensiva: evita continuar si falta algun nodo del HTML.
if (!searchInput || !userList || !profileCard || !postGrid || !resultCount) {
  throw new Error("No se encontraron elementos base de la pantalla.");
}

// Estado reactivo de usuarios fuente y usuario seleccionado.
const users$ = new BehaviorSubject(users);
const selectedUserId$ = new BehaviorSubject(null);

// Stream de busqueda: limpia texto, espera breve pausa y evita repetidos.
const search$ = fromEvent(searchInput, "input").pipe(
  map((event) => event.target.value.trim().toLowerCase()),
  debounceTime(220),
  distinctUntilChanged(),
  startWith(""),
);

// Usuarios filtrados por query actual.
// Regla solicitada: si no hay texto escrito, no se muestra ningun resultado.
const filteredUsers$ = combineLatest([users$, search$]).pipe(
  map(([allUsers, query]) => {
    if (!query) {
      return [];
    }

    return allUsers.filter((user) => {
      const searchableText = `${user.name} ${user.handle} ${user.city} ${user.role}`.toLowerCase();
      return searchableText.includes(query);
    });
  }),
);

// Usuario visible seleccionado.
// Si la lista filtrada queda vacia o no hay seleccion, devolvemos null.
const selectedUser$ = combineLatest([filteredUsers$, selectedUserId$]).pipe(
  map(([visibleUsers, selectedId]) => {
    if (selectedId === null) {
      return null;
    }

    return visibleUsers.find((user) => user.id === selectedId) ?? null;
  }),
);

// Render del listado segun resultados de busqueda.
filteredUsers$.subscribe((list) => {
  resultCount.textContent = `${list.length} resultado${list.length === 1 ? "" : "s"}`;

  // Cuando no hay coincidencias (o query vacia), limpiamos seleccion y lista.
  if (list.length === 0) {
    selectedUserId$.next(null);
    userList.innerHTML = "";
    return;
  }

  const currentId = selectedUserId$.getValue();
  const existsCurrentSelection = list.some((user) => user.id === currentId);

  // Si la seleccion actual no existe en el filtrado, se toma el primero.
  if (!existsCurrentSelection) {
    selectedUserId$.next(list[0].id);
  }

  // Reconstruimos la lista visible.
  userList.innerHTML = "";
  list.forEach((user, index) => {
    const item = document.createElement("li");
    const isActive = selectedUserId$.getValue() === user.id;

    item.innerHTML = `
      <button class="user-item ${isActive ? "is-active" : ""}" data-id="${user.id}" style="animation-delay: ${index * 40}ms;">
        <span class="avatar" style="background: ${user.color}">${getInitials(user.name)}</span>
        <span>
          <span class="user-name">${user.name}</span>
          <span class="user-handle">${user.handle} - ${user.city}</span>
        </span>
      </button>
    `;

    // Al hacer click en un item, actualizamos el usuario seleccionado.
    const button = item.querySelector("button");
    if (button) {
      button.addEventListener("click", () => selectedUserId$.next(user.id));
    }

    userList.appendChild(item);
  });
});

// Render del perfil y publicaciones del usuario activo.
selectedUser$.subscribe((user) => {
  // Si no hay usuario seleccionado visible, no mostramos nada.
  if (!user) {
    profileCard.innerHTML = "";
    postGrid.innerHTML = "";
    return;
  }

  profileCard.innerHTML = `
    <div class="profile-top">
      <div class="profile-avatar" style="background: ${user.color}">${getInitials(user.name)}</div>
      <div>
        <h2 class="profile-name">${user.name}</h2>
        <p class="profile-handle">${user.handle} - ${user.city}</p>
        <span class="badge">${user.verified ? "Verificado" : "Miembro"} - ${user.role}</span>
      </div>
    </div>
    <p class="profile-bio">${user.bio}</p>
    <div class="profile-meta">
      <article class="meta-box">
        <p class="meta-label">Seguidores</p>
        <p class="meta-value">${formatCompactNumber(user.followers)}</p>
      </article>
      <article class="meta-box">
        <p class="meta-label">Seguidos</p>
        <p class="meta-value">${formatCompactNumber(user.following)}</p>
      </article>
      <article class="meta-box">
        <p class="meta-label">Posts</p>
        <p class="meta-value">${user.posts.length}</p>
      </article>
    </div>
  `;

  // Render de los posts del usuario seleccionado.
  postGrid.innerHTML = "";
  user.posts.forEach((post, index) => {
    const card = document.createElement("article");
    card.className = "post-card";
    card.style.animationDelay = `${index * 70}ms`;
    card.innerHTML = `
      <h3 class="post-title">${post.title}</h3>
      <p class="post-content">${post.content}</p>
    `;
    postGrid.appendChild(card);
  });
});

// Obtiene iniciales de un nombre para usarlas en avatar.
function getInitials(fullName) {
  return fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

// Formatea numeros grandes en notacion compacta local.
function formatCompactNumber(value) {
  return new Intl.NumberFormat("es-CO", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
