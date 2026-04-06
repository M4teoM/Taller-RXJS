import { from, interval, of, range, take } from "rxjs";
import { usuarios } from "../recursos/datos.js";
import { titulo, paso } from "../recursos/log.js";

titulo("Ejercicio 2 - Metodos de creacion");

paso("of(): emisiones con argumentos individuales.");
const ofEjemplo$ = of("uno", "dos", "tres");
ofEjemplo$.subscribe((valor) => console.log("of ->", valor));

paso("from(): emisiones desde arreglo.");
const fromEjemplo$ = from(usuarios.map((u) => u.nombre));
fromEjemplo$.subscribe((valor) => console.log("from ->", valor));

paso("range(): secuencia numerica.");
const rangeEjemplo$ = range(10, 4);
rangeEjemplo$.subscribe((valor) => console.log("range ->", valor));

paso("interval(): emisiones periodicas por tiempo.");
const intervalEjemplo$ = interval(300).pipe(take(4));
intervalEjemplo$.subscribe({
  next: (valor) => console.log("interval ->", valor),
  complete: () => console.log("interval -> completado"),
});
