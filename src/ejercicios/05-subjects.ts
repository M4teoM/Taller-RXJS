import { Subject } from "rxjs";
import { titulo, paso } from "../recursos/log.js";

titulo("Ejercicio 5 - Subjects");

const eventos$ = new Subject<string>();

paso("Crear dos suscriptores y emitir eventos manuales.");

eventos$.subscribe((evento) => console.log("A recibio:", evento));
eventos$.subscribe((evento) => console.log("B recibio:", evento));

// TODO: en el taller podemos mover estas emisiones a funciones o UI

eventos$.next("click");
eventos$.next("submit");
eventos$.complete();
