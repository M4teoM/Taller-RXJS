import { filter, from, map, reduce, take } from "rxjs";
import { titulo, paso } from "../recursos/log.js";

titulo("Ejercicio 3 - Pipes y operadores");

paso("Aplicar pipe con take, map, filter y reduce en secuencia.");

const numeros$ = from([1, 2, 3, 4, 5, 6]);

numeros$
  .pipe(
    take(5),
    map((n) => n * 2),
    filter((n) => n % 3 === 0),
    reduce((acumulado, actual) => acumulado + actual, 0),
  )
  .subscribe((resultado) => console.log("Resultado final reduce ->", resultado));
