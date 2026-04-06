import { Observable, concatMap, mergeMap, of } from "rxjs";
import { titulo, paso } from "../recursos/log.js";

type UsuarioApi = { id: number; nombre: string };
type PostApi = { id: number; userId: number; titulo: string };

type HttpClient = {
  get<T>(url: string): Observable<T>;
};

class HttpClientSimulado implements HttpClient {
  private readonly usuario: UsuarioApi = { id: 7, nombre: "Ana" };
  private readonly posts: PostApi[] = [
    { id: 101, userId: 7, titulo: "Post 1" },
    { id: 102, userId: 7, titulo: "Post 2" },
  ];

  get<T>(url: string): Observable<T> {
    if (url === "/api/usuarios/actual") {
      return of(this.usuario as T);
    }

    if (url.startsWith("/api/posts?userId=")) {
      const userId = Number(url.split("=")[1]);
      const postsFiltrados = this.posts.filter((p) => p.userId === userId);
      return of(postsFiltrados as T);
    }

    return of([] as T);
  }
}

class UsuarioComponent {
  usuario$!: Observable<UsuarioApi>;
  posts$!: Observable<PostApi[]>;

  // Simula inyeccion de HttpClient en Angular.
  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    paso("ngOnInit(): ejecutar GET de usuario actual.");
    this.usuario$ = this.http.get<UsuarioApi>("/api/usuarios/actual");

    this.usuario$.subscribe((usuario) => {
      console.log("usuario ->", usuario);
    });
  }

  cargarUsuarioYPostsConMergeMap(): void {
    paso("Encadenar peticiones con mergeMap para evitar ID nulo.");

    const usuarioConPosts$ = this.http
      .get<UsuarioApi>("/api/usuarios/actual")
      .pipe(
        mergeMap((usuario) =>
          this.http.get<PostApi[]>(`/api/posts?userId=${usuario.id}`).pipe(mergeMap((posts) => of({ usuario, posts }))),
        ),
      );

    usuarioConPosts$.subscribe(({ usuario, posts }) => {
      console.log("mergeMap -> usuario", usuario);
      console.log("mergeMap -> posts", posts);
    });
  }

  cargarUsuarioYPostsConConcatMap(): void {
    paso("Alternativa secuencial con concatMap.");

    const usuarioConPosts$ = this.http
      .get<UsuarioApi>("/api/usuarios/actual")
      .pipe(
        concatMap((usuario) =>
          this.http.get<PostApi[]>(`/api/posts?userId=${usuario.id}`).pipe(mergeMap((posts) => of({ usuario, posts }))),
        ),
      );

    usuarioConPosts$.subscribe(({ usuario, posts }) => {
      console.log("concatMap -> usuario", usuario);
      console.log("concatMap -> posts", posts);
    });
  }
}

titulo("Ejercicio 7 - Integracion Angular + HttpClient (simulada)");

const httpClient = new HttpClientSimulado();
const componente = new UsuarioComponent(httpClient);

componente.ngOnInit();
componente.cargarUsuarioYPostsConMergeMap();
componente.cargarUsuarioYPostsConConcatMap();
