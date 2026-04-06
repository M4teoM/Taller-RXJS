import { concat, interval, map, merge, take } from "rxjs";
import { titulo, paso } from "../recursos/log.js";

titulo("Ejercicio 4 - Combinacion");

paso("merge(): mezcla mensajes de varios observables por tiempo.");

const flujoA$ = interval(300).pipe(
  take(4),
  map((n) => `A${n}`),
);

const flujoB$ = interval(500).pipe(
  take(3),
  map((n) => `B${n}`),
);

merge(flujoA$, flujoB$).subscribe({
  next: (valor) => console.log("merge ->", valor),
  complete: () => {
    paso("concat(): espera a que termine el primero para iniciar el segundo.");
    const primero$ = interval(250).pipe(
      take(3),
      map((n) => `primero-${n}`),
    );
    const segundo$ = interval(250).pipe(
      take(3),
      map((n) => `segundo-${n}`),
    );

    concat(primero$, segundo$).subscribe({
      next: (valor) => console.log("concat ->", valor),
      complete: () => console.log("Comparacion merge/concat finalizada"),
    });
  },
});
