import { catchError, of, throwError } from "rxjs";
import { titulo, paso } from "../recursos/log.js";

titulo("Ejercicio 6 - Manejo de errores");

paso("Simular error y recuperar con catchError.");

const api$ = throwError(() => new Error("Fallo de red simulado"));

api$
  .pipe(
    catchError((error) => {
      console.log("Error capturado:", error.message);
      // TODO: reemplazar por una estrategia real de fallback
      return of({ ok: false, data: [] });
    }),
  )
  .subscribe((respuesta) => console.log("respuesta", respuesta));
