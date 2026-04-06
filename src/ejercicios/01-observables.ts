import { Observable, Observer, of } from "rxjs";
import { titulo, paso } from "../recursos/log.js";

titulo("Ejercicio 1 - Observables");

paso("1) Crear un observable manual publish-subscribe con mensajes de texto.");
const mensajes$ = new Observable<string>((subscriber) => {
  subscriber.next("Hola desde RxJS");
  subscriber.next("Segundo mensaje");
  subscriber.next("Tercer mensaje");
  subscriber.complete();
});

paso("2) Definir observer (objeto JSON) con next, error y complete.");
const observador: Observer<string> = {
  next: (mensaje) => console.log("observer.next ->", mensaje),
  error: (err) => console.error("observer.error ->", err),
  complete: () => console.log("observer.complete -> flujo finalizado"),
};

paso("3) Suscribir observable con observer.");
mensajes$.subscribe(observador);

paso("4) Ejemplo corto con of(...).");
const rapido$ = of("A", "B", "C");

rapido$.subscribe((v) => console.log("of ->", v));

paso("5) Tambien puede suscribirse en linea.");
mensajes$.subscribe({
  next: (mensaje) => console.log("inline.next ->", mensaje),
  error: (err) => console.error("inline.error ->", err),
  complete: () => console.log("inline.complete -> ok"),
});
